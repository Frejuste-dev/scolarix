from sqlalchemy.orm import Session
from models.teacher import Teacher
from models.user import User
from schemas.teacher import TeacherCreate, TeacherUpdate
from config.security import get_password_hash
from fastapi import HTTPException

class TeacherController:
    
    @staticmethod
    def create_teacher(db: Session, teacher_data: TeacherCreate):
        # Create user first
        hashed_password = get_password_hash(teacher_data.password)
        new_user = User(
            firstname=teacher_data.firstname,
            lastname=teacher_data.lastname,
            email=teacher_data.email,
            password_hash=hashed_password
        )
        db.add(new_user)
        db.flush()
        
        # Create teacher
        new_teacher = Teacher(
            userID=new_user.userID,
            grade=teacher_data.grade,
            phone=teacher_data.phone,
            address=teacher_data.address
        )
        db.add(new_teacher)
        db.commit()
        db.refresh(new_teacher)
        return new_teacher
    
    @staticmethod
    def get_all_teachers(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Teacher).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_teacher_by_id(db: Session, teacher_id: int):
        teacher = db.query(Teacher).filter(Teacher.userID == teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Enseignant non trouvé")
        return teacher
    
    @staticmethod
    def update_teacher(db: Session, teacher_id: int, teacher_update: TeacherUpdate):
        teacher = db.query(Teacher).filter(Teacher.userID == teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Enseignant non trouvé")
            
        user = db.query(User).filter(User.userID == teacher_id).first()
        
        # Update User fields
        if teacher_update.firstname: user.firstname = teacher_update.firstname
        if teacher_update.lastname: user.lastname = teacher_update.lastname
        if teacher_update.email: user.email = teacher_update.email
        
        # Update Teacher fields
        update_data = teacher_update.dict(exclude_unset=True)
        teacher_fields = {'grade', 'phone', 'address'}
        for key, value in update_data.items():
            if key in teacher_fields:
                setattr(teacher, key, value)
        
        db.commit()
        db.refresh(teacher)
        return teacher
    
    @staticmethod
    def delete_teacher(db: Session, teacher_id: int):
        teacher = db.query(Teacher).filter(Teacher.userID == teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Enseignant non trouvé")
        
        user = db.query(User).filter(User.userID == teacher_id).first()
        db.delete(user)
        db.commit()
        return {"message": "Enseignant supprimé avec succès"}
