import os
import logging
from backend.config import settings

logger = logging.getLogger("ai_engine")

class AIEngine:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini AI Client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini AI Client: {e}")

    def ask_ai_study_assistant(self, question: str, subject: str = "General") -> str:
        """Asks Gemini AI for study advice / question answering with offline fallback."""
        if not self.client or settings.is_standalone and not self.api_key:
            return (
                f"[오프라인/기본 모드] '{subject}' 관련 질문: '{question}'\n\n"
                "현재 스탠드얼론 오프라인 모드로 구동 중입니다. "
                "인터넷 및 Gemini API 키가 연결되면 실시간 AI RAG 답변이 제공됩니다."
            )

        try:
            prompt = (
                f"당신은 스터디카페 학습 케어 AI 튜터입니다.\n"
                f"과목: {subject}\n"
                f"질문: {question}\n\n"
                f"학생에게 친절하고 명확하게 공부 답변과 설명 및 공부 팁을 3문장 이내로 제공해주세요."
            )
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Exception: {e}")
            return f"[AI 응답 오류] 질문에 대한 응답을 생성하는 중 문제가 발생했습니다: {str(e)}"

ai_engine = AIEngine()
