from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone

from .models import CustomUser, Curator, Category, AchievementRequest, XPLedger

try:
	from .utils import calculate_level  # optional utility that may be added later
	HAS_CALCULATE_LEVEL = True
except Exception:
	HAS_CALCULATE_LEVEL = False


class BackendMVPTests(APITestCase):
	def setUp(self):
		# Users
		self.student1 = CustomUser.objects.create_user(username='s1', email='s1@example.com', password='pwd', role='student')
		self.student2 = CustomUser.objects.create_user(username='s2', email='s2@example.com', password='pwd', role='student')
		self.curator = CustomUser.objects.create_user(username='cur', email='cur@example.com', password='pwd', role='curator')
		Curator.objects.create(user=self.curator)

		# Category
		self.cat = Category.objects.create(name='contest')

	def auth_as(self, user):
		self.client.force_authenticate(user=user)

	def test_calculate_level_boundaries(self):
		"""Проверка граничных значений функции calculate_level, если она присутствует."""
		if not HAS_CALCULATE_LEVEL:
			self.skipTest('calculate_level not available in api.utils')

		# expected mapping: 0..99 -> 1, 100..199 -> 2, 200..299 -> 3
		self.assertEqual(calculate_level(0), 1)
		self.assertEqual(calculate_level(99), 1)
		self.assertEqual(calculate_level(100), 2)
		self.assertEqual(calculate_level(199), 2)
		self.assertEqual(calculate_level(200), 3)

	def test_xp_accrued_only_on_approved(self):
		# create request by student1
		req = AchievementRequest.objects.create(user=self.student1, category=self.cat, text='win', ai_suggested_xp=30)

		# as curator approve
		self.auth_as(self.curator)
		url = f'/api/curator/requests/{req.id}/'
		resp = self.client.patch(url, {'status': 'approved', 'final_xp': 40}, format='json')
		print('DBG: approve response:', resp.status_code, getattr(resp, 'data', None) or resp.content)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)

		# ledger must be created
		self.assertTrue(XPLedger.objects.filter(request=req).exists())

		# create another request and reject it
		req2 = AchievementRequest.objects.create(user=self.student1, category=self.cat, text='fail', ai_suggested_xp=10)
		resp2 = self.client.patch(f'/api/curator/requests/{req2.id}/', {'status': 'rejected'}, format='json')
		print('DBG: reject response:', resp2.status_code, getattr(resp2, 'data', None) or resp2.content)
		self.assertEqual(resp2.status_code, status.HTTP_200_OK)
		self.assertFalse(XPLedger.objects.filter(request=req2).exists())

	def test_student_cannot_see_others_requests(self):
		# create a request for student2
		req = AchievementRequest.objects.create(user=self.student2, category=self.cat, text='other', ai_suggested_xp=15)

		# authenticate as student1 and list requests
		self.auth_as(self.student1)
		resp = self.client.get('/api/requests/')
		print('DBG: student list response:', resp.status_code, getattr(resp, 'data', None) or resp.content)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		ids = [item.get('id') for item in resp.json()]
		self.assertNotIn(req.id, ids)

	def test_curator_cannot_approve_nonexistent_request(self):
		self.auth_as(self.curator)
		# choose a large id that should not exist
		resp = self.client.patch('/api/curator/requests/999999/', {'status': 'approved', 'final_xp': 10}, format='json')
		self.assertIn(resp.status_code, (status.HTTP_404_NOT_FOUND, status.HTTP_400_BAD_REQUEST))

	def test_unauthorized_user_has_no_access(self):
		# no auth
		self.client.force_authenticate(user=None)
		resp = self.client.get('/api/requests/')
		self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

