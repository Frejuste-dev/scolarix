from models.student import Student
from models.user import User
from config.security import get_password_hash
from fastapi import HTTPException
from sqlalchemy.orm import Session
from schemas.student import StudentCreate, StudentUpdate

class StudentController:
    
    @staticmethod
    def create_student(db: Session, student_data: StudentCreate):
        # Create user first
        hashed_password = get_password_hash(student_data.password)
        new_user = User(
            firstname=student_data.firstname,
            lastname=student_data.lastname,
            email=student_data.email,
            password_hash=hashed_password
        )
        db.add(new_user)
        db.flush()
        
        # Create student
        new_student = Student(
            userID=new_user.userID,
            matricule=student_data.matricule,
            birthdate=student_data.birthdate,
            gender=student_data.gender,
            phone=student_data.phone,
            address=student_data.address
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    
    @staticmethod
    def get_all_students(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Student).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_student_by_id(db: Session, student_id: int):
        student = db.query(Student).filter(Student.userID == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return student
    
    @staticmethod
    def update_student(db: Session, student_id: int, student_update: StudentUpdate):
        student = db.query(Student).filter(Student.userID == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
            
        user = db.query(User).filter(User.userID == student_id).first()
        
        # Update User fields
        if student_update.firstname: user.firstname = student_update.firstname
        if student_update.lastname: user.lastname = student_update.lastname
        if student_update.email: user.email = student_update.email
        
        # Update Student fields
        update_data = student_update.dict(exclude_unset=True)
        # Remove user fields from this dict as they are handled above or not in Student model
        student_fields = {'matricule', 'birthdate', 'gender', 'phone', 'address'}
        for key, value in update_data.items():
            if key in student_fields:
                setattr(student, key, value)
        
        db.commit()
        db.refresh(student)
        return student
    
    @staticmethod
    def delete_student(db: Session, student_id: int):
        student = db.query(Student).filter(Student.userID == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        
        # Cascading delete should handle User, but explicit is safer if not configured
        # Assuming ON DELETE CASCADE is set in DB, deleting User deletes Student
        user = db.query(User).filter(User.userID == student_id).first()
        db.delete(user) 
        db.commit()
        return {"message": "Étudiant supprimé avec succès"}
        