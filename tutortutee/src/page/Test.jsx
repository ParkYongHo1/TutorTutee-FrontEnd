import React, { useState } from "react";

const TodoItem = ({ item, onDelete }) => {
  return (
    <div>
      {item.text}
      <button onClick={() => onDelete(item.id)}>삭제</button>
    </div>
  );
};

const Test = () => {
  const mockData = [
    { id: 1, text: "할 일 1" },
    { id: 2, text: "할 일 2" },
    { id: 3, text: "할 일 3" },
  ];

  const [state, setState] = useState(mockData);

  const handleDelete = (id) => {
    // 상태를 업데이트하지 않음
    console.log(`삭제할 아이디: ${id}`);
    // setState(state.filter((item) => item.id !== id)); // 이 줄을 주석 처리하여 렌더링을 방지
  };

  return (
    <>
      <div>
        {state.map((item) => (
          <TodoItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
};

export default Test;
