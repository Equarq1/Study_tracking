import os
from dotenv import load_dotenv
import google.generativeai as genai

# Загружаем наш .env
load_dotenv()

# Достаем ключ
api_key = os.getenv("GEMINI_API_KEY")

# Настраиваем Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Отправляем простейший вопрос
response = model.generate_content("Напиши 'Всё настроено верно!'")
print(response.text)