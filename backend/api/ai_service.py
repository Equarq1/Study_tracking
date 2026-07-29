import os
import json
import requests
import uuid
import logging
from pathlib import Path
from dotenv import load_dotenv

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- БЕЗОПАСНАЯ ЗАГРУЗКА .env ---
# .parent — это путь к папке 'backend', где лежит файл .env
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

def analyze_achievement_with_ai(category_name: str, text: str) -> dict:
    """
    Оценивает достижение через GigaChat API.
    """
    # Получаем ключ из переменных окружения
    auth_key = os.getenv("GIGACHAT_CREDENTIALS")

    if not auth_key:
        logger.error(f"Ключ GIGACHAT_CREDENTIALS не найден! Искали здесь: {env_path}")
        return {"xp": 0, "explanation": "Ошибка конфигурации сервера."}

    auth_key = auth_key.strip()

    try:
        # --- ШАГ 1: Получение токена ---
        token_url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "RqUID": str(uuid.uuid4()),
            "Authorization": f"Basic {auth_key}"
        }
        data = {"scope": "GIGACHAT_API_PERS"}

        token_response = requests.post(token_url, headers=headers, data=data, verify=False)
        token_response.raise_for_status()
        access_token = token_response.json()["access_token"]

        # --- ШАГ 2: Запрос к модели ---
        chat_url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
        headers_chat = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        prompt = (f"Ты — эксперт. Категория: '{category_name}'. Достижение: '{text}'. "
                  "Оцени достижение и начисли XP от 0 до 100. "
                  "Верни ответ СТРОГО в формате JSON: {\"xp\": int, \"explanation\": \"краткое обоснование\"}")

        payload = {
            "model": "GigaChat",
            "messages": [{"role": "user", "content": prompt}]
        }

        chat_response = requests.post(chat_url, headers=headers_chat, json=payload, verify=False)
        chat_response.raise_for_status()

        # --- ШАГ 3: Безопасный парсинг JSON ---
        content = chat_response.json()["choices"][0]["message"]["content"]

        start = content.find('{')
        end = content.rfind('}') + 1

        if start != -1 and end != -1:
            return json.loads(content[start:end])
        else:
            logger.error(f"Ответ модели не содержит JSON: {content}")
            return {"xp": 0, "explanation": "Ошибка формата ответа."}

    except Exception as e:
        logger.error(f"Ошибка при работе с GigaChat: {e}")
        return {"xp": 20, "explanation": "Сервис оценки временно недоступен."} .update()