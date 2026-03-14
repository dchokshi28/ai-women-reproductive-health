from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from app.config.config import settings

class HealthAIAgent:
    def __init__(self):
        self.llm = None
        if settings.OPENAI_API_KEY:
            try:
                self.llm = ChatOpenAI(
                    temperature=0.7,
                    model="gpt-3.5-turbo",
                    openai_api_key=settings.OPENAI_API_KEY
                )
            except Exception as e:
                print(f"Failed to initialize LangChain: {e}")
    
    def get_health_insights(self, cycle_data: dict):
        if not self.llm:
            return self._fallback_insights(cycle_data)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a women's health AI assistant. Provide helpful, empathetic insights about menstrual health."),
            ("user", """Based on this cycle data:
            - Cycle Length: {cycle_length} days
            - Period Duration: {period_duration} days
            - Pain Level: {pain_level}/5
            - Flow Intensity: {flow_intensity}/3
            - Mood Changes: {mood_changes}/5
            
            Provide brief health insights and lifestyle recommendations (max 3 sentences).""")
        ])
        
        try:
            chain = LLMChain(llm=self.llm, prompt=prompt)
            response = chain.run(**cycle_data)
            return response
        except Exception as e:
            print(f"LangChain error: {e}")
            return self._fallback_insights(cycle_data)
    
    def _fallback_insights(self, cycle_data):
        insights = []
        
        if cycle_data.get('pain_level', 0) >= 4:
            insights.append("High pain levels detected. Consider heat therapy and consult a doctor if persistent.")
        
        if cycle_data.get('cycle_length', 28) > 35 or cycle_data.get('cycle_length', 28) < 21:
            insights.append("Your cycle length is outside the typical range. Track for 3 months and consult a healthcare provider.")
        
        if cycle_data.get('mood_changes', 0) >= 4:
            insights.append("Significant mood changes noted. Regular exercise and stress management may help.")
        
        return " ".join(insights) if insights else "Your cycle appears normal. Continue healthy habits!"
    
    def answer_health_question(self, question: str):
        if not self.llm:
            return "AI assistant is not configured. Please set OPENAI_API_KEY."
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a knowledgeable women's health assistant. Provide accurate, supportive information about reproductive health, menstruation, and wellness. Always recommend consulting healthcare professionals for medical concerns."),
            ("user", "{question}")
        ])
        
        try:
            chain = LLMChain(llm=self.llm, prompt=prompt)
            response = chain.run(question=question)
            return response
        except Exception as e:
            return f"Unable to process question: {str(e)}"

health_ai_agent = HealthAIAgent()
