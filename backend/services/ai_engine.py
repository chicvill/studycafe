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
        """Asks Gemini AI for study advice / question answering with offline fallback and multi-model retry."""
        if not self.client or not self.api_key:
            return (
                f"[오프라인/기본 모드] '{subject}' 관련 질문: '{question}'\n\n"
                "Google AI Studio(https://aistudio.google.com)에서 발급받은 Gemini API Key를 "
                ".env 파일의 GEMINI_API_KEY에 입력하시면 실시간 AI 튜터 RAG 답변이 제공됩니다."
            )

        prompt = (
            f"당신은 스터디카페 학습 케어 AI 튜터입니다.\n"
            f"과목: {subject}\n"
            f"질문: {question}\n\n"
            f"학생에게 친절하고 명확하게 공부 답변과 설명 및 공부 팁을 3문장 이내로 제공해주세요."
        )

        models_to_try = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash-lite", "gemini-flash-latest"]
        last_error = ""

        for model_name in models_to_try:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                if response and hasattr(response, 'text') and response.text:
                    return response.text
            except Exception as e:
                last_error = str(e)
                logger.warning(f"Model {model_name} execution failed: {e}")
                continue

        if "RESOURCE_EXHAUSTED" in last_error or "limit: 0" in last_error or "429" in last_error:
            return (
                f"[Google API 프로젝트 설정 필요 (Quota Limit: 0)]\n\n"
                "입력하신 API Key는 정상 연결되었으나, Google Cloud 프로젝트(projects/360399739923)의 Generative Language API 할당량이 0으로 제한되어 있습니다.\n\n"
                "💡 해결 방법:\n"
                "1. https://aistudio.google.com/app/apikey 접속 후 상단 프로젝트 선택에서 [기본 프로젝트 (Default Project)]를 선택하여 API Key를 다시 생성하거나,\n"
                "2. Google Cloud Console(console.cloud.google.com)에서 해당 프로젝트의 'Generative Language API' 서비스를 [사용 설정(Enable)] 해 주시면 즉시 작동합니다."
            )

        return (
            f"[AI API 호출 오류]\n\n"
            f"Gemini API 호출 중 오류가 발생했습니다: {last_error}\n"
            "https://aistudio.google.com 에서 API Key 상태를 확인해 주세요."
        )

ai_engine = AIEngine()
