// app.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// JSON 요청 본문 파싱 활성화 (POST, PUT 요청 처리)
app.use(express.json());

// 1. 초기 도서 데이터 (배열 형태)
let books = [
    { id: 1, title: '노드JS 마스터 가이드', author: '제미니', publishedYear: 2023 },
    { id: 2, title: 'Express로 API 만들기', author: '개발자 B', publishedYear: 2024 },
    { id: 3, title: '웹 서비스 배포의 모든 것', author: '개발자 C', publishedYear: 2025 }
];
let nextId = 4; // 다음에 추가될 책의 ID

// 2. 기본 경로 라우트 (서버 작동 확인용)
app.get('/', (req, res) => {
    res.send('도서 관리 API 서버가 시작되었습니다!');
});

// 3. 도서 관련 CRUD 라우트
// [GET] 모든 도서 목록 조회
app.get('/books', (req, res) => {
    // 쿼리 파라미터로 제목 검색 기능 구현
    const { title } = req.query;
    if (title) {
        const filteredBooks = books.filter(book => book.title.includes(title));
        return res.json(filteredBooks);
    }
    res.json(books);
});

// [GET] 특정 ID의 도서 상세 정보 조회
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).send('도서를 찾을 수 없습니다.');
    }
    res.json(book);
});

// [POST] 새로운 도서 추가
app.post('/books', (req, res) => {
    const { title, author, publishedYear } = req.body;

    if (!title || !author || !publishedYear) {
        return res.status(400).send('제목, 저자, 출판 연도를 모두 입력해야 합니다.');
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        publishedYear
    };

    books.push(newBook);
    // 201 Created 응답과 함께 새로 생성된 객체를 반환
    res.status(201).json(newBook);
});

// [PUT] 특정 ID의 도서 정보 수정
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).send('도서를 찾을 수 없습니다.');
    }

    const { title, author, publishedYear } = req.body;
    
    // 필수 정보 누락 여부 확인 (수정할 정보가 없으면 400 반환)
    if (!title && !author && !publishedYear) {
        return res.status(400).send('수정할 정보를 입력해야 합니다.');
    }

    // 기존 정보에 새 정보를 덮어쓰기
    books[index] = {
        ...books[index],
        title: title || books[index].title,
        author: author || books[index].author,
        publishedYear: publishedYear || books[index].publishedYear,
    };

    res.json(books[index]);
});

// [DELETE] 특정 ID의 도서 정보 삭제
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    
    // ID가 일치하지 않는 책들만 남기고 배열을 재구성
    books = books.filter(b => b.id !== id);

    if (books.length === initialLength) {
        return res.status(404).send('도서를 찾을 수 없습니다.');
    }

    // 204 No Content (삭제 성공)
    res.status(204).send();
});


// 4. 오류 처리 (404 라우트가 정의되지 않은 모든 요청)
app.use((req, res, next) => {
    res.status(404).send('지정된 라우트를 찾을 수 없습니다.');
});


// 5. 서버 실행
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});