// 1. Express 모듈 가져오기
const express = require('express');

// 2. Express 앱 생성
const app = express();

// 3. 배포 환경을 고려하여 PORT를 환경 변수에서 가져오고, 없으면 3000을 사용
const PORT = process.env.PORT || 3000;

// =================================================================
// 미들웨어 설정
// JSON 요청 본문(Body)을 파싱하기 위한 미들웨어 (POST/PUT 요청 처리에 필수)
// =================================================================
app.use(express.json());

// =================================================================
// [데이터 저장소] 메모리 배열 및 ID 관리
// 서버가 재시작되면 데이터는 초기화됩니다.
// =================================================================
let nextId = 1;
let books = [
  { id: nextId++, title: '노드JS 마스터 가이드', author: '제미니', publishedYear: 2023 },
  { id: nextId++, title: 'Express로 API 만들기', author: '개발자 B', publishedYear: 2024 },
];

// =================================================================
// [API 라우팅] 도서 관리 CRUD 구현
// =================================================================

// [READ: 전체 조회] 모든 도서 목록 가져오기 (GET /books)
app.get('/books', (req, res) => {
  console.log('GET /books 요청');
  res.json(books);
});

// [READ: 개별 조회] 특정 ID의 도서 가져오기 (GET /books/:id)
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (book) {
    res.json(book);
  } else {
    // 404 Not Found 응답
    res.status(404).json({ message: '해당 도서(ID: ' + id + ')를 찾을 수 없습니다.' });
  }
});

// [CREATE] 새 도서 등록 (POST /books)
app.post('/books', (req, res) => {
  const { title, author, publishedYear } = req.body;

  if (!title || !author) {
    // 400 Bad Request 응답
    return res.status(400).json({ message: '도서 제목과 저자는 필수 항목입니다.' });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
  };

  books.push(newBook);
  // 201 Created 응답과 함께 새로 생성된 도서를 반환합니다.
  res.status(201).json(newBook);
});

// [UPDATE] 특정 도서 정보 수정 (PUT /books/:id)
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: '수정할 도서를 찾을 수 없습니다.' });
  }

  const { title, author, publishedYear } = req.body;

  // 기존 도서 정보 업데이트
  books[index] = {
    ...books[index],
    title: title || books[index].title,
    author: author || books[index].author,
    publishedYear: publishedYear ? parseInt(publishedYear) : books[index].publishedYear,
  };

  res.json(books[index]);
});

// [DELETE] 특정 도서 삭제 (DELETE /books/:id)
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = books.length;
  
  // ID가 일치하는 도서를 제외하고 배열을 재구성합니다.
  books = books.filter(b => b.id !== id);

  if (books.length < initialLength) {
    res.status(200).json({ message: `ID ${id}인 도서가 성공적으로 삭제되었습니다.` });
  } else {
    res.status(404).json({ message: '삭제할 도서를 찾을 수 없습니다.' });
  }
});


// [기본 라우트] 서버 시작 확인용 (GET /)
app.get('/', (req, res) => {
  res.send('도서 관리 API 서버가 시작되었습니다!');
});

// 5. 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});