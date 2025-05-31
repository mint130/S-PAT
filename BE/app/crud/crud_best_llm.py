from sqlalchemy.orm import Session

from app.models.LLM import LLM


def get_best_llm(db: Session) -> str:
    # DB에서 최적의 LLM 조회회
    llm_record = db.query(LLM).first()
    
    # 레코드가 존재하면 llm 값 반환, 없으면 기본값 반환
    if llm_record:
        return llm_record.llm
    else:
        return "GPT"  # 기본값 반환
    

def update_best_llm(db:Session, llm_name: str) -> LLM:
    # 최적의 LLM을 업데이트
    # 존재하지 않으면 새로 생성하고, 존재하면 업데이트


    # 기존 레코드 확인
    llm_record = db.query(LLM).first()

    if llm_record:
        # 업데이트
        llm_record.llm = llm_name

    else:
        # 없는 경우 생성
        llm_record = LLM(llm = llm_name)
        db.add(llm_record)

    # 변경사항 저장
    db.commit()
    db.refresh(llm_record)

    return llm_record
