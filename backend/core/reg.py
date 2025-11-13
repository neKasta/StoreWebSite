import asyncio
from database.models import User, async_session
from sqlalchemy import select, or_, func

async def register_user(username: str, email: str, password: str):
    async with async_session() as session:
        try:
            existing_user = await session.scalar(
                select(User).where(or_(func.lower(User.username) == func.lower(username),func.lower(User.email) == func.lower(email))))

            if existing_user:
                if func.lower(existing_user.username) == func.lower(username):
                    return False, 'Имя пользователя уже занято', None
                elif func.lower(existing_user.email) == func.lower(email):
                    return False, 'Почта уже используется', None
            
            new_user = User(
                username=username,
                email=email,
                password=password 
            )
            
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            
            return True, 'Регистрация успешна!', new_user
            
        except Exception as e:
            await session.rollback()
            return False, f'Ошибка сервера: {str(e)}', None

def validate_registration_data(username: str, email: str, password: str):
    errors = []
    
    if len(username) < 4:
        errors.append("Имя пользователя должно содержать минимум 4 символа")
    if len(username) > 20:
        errors.append("Имя пользователя не должно превышать 20 символов")
    
    if '@' not in email or '.' not in email:
        errors.append("Введите корректный email")
    
    if len(password) < 6:
        errors.append("Пароль должен содержать минимум 6 символов")
    
    return errors