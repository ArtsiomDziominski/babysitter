# API Документация для Frontend разработчика

## Базовый URL

```
http://localhost:3000/api
```

## Аутентификация

Все защищенные endpoints требуют JWT токен в заголовке:

```
Authorization: Bearer <your_jwt_token>
```

### Регистрация

**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "parent" | "babysitter",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "parent",
    "firstName": "Иван",
    "lastName": "Иванов"
  }
}
```

### Вход

**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "parent",
    "firstName": "Иван",
    "lastName": "Иванов"
  }
}
```

---

## Пользователи

### Получить профиль текущего пользователя

**GET** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "parent",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Обновить профиль

**PUT** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

---

## Няни

### Получить список нянь

**GET** `/babysitters?page=1&limit=10&minAge=18&maxAge=50&minRate=500&maxRate=2000`

**Query Parameters:**
- `page` (number, optional) - номер страницы (по умолчанию: 1)
- `limit` (number, optional) - количество на странице (по умолчанию: 10)
- `minAge` (number, optional) - минимальный возраст
- `maxAge` (number, optional) - максимальный возраст
- `minRate` (number, optional) - минимальная ставка за час
- `maxRate` (number, optional) - максимальная ставка за час
- `search` (string, optional) - поиск по имени/описанию

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 2,
      "age": 25,
      "experience": 3,
      "hourlyRate": 1000,
      "certifications": ["CPR", "First Aid"],
      "bio": "Опытная няня с 3 годами стажа",
      "rating": 4.8,
      "reviewsCount": 15,
      "user": {
        "firstName": "Мария",
        "lastName": "Петрова",
        "phone": "+79001234568"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Получить детали няни

**GET** `/babysitters/:id`

**Response (200):**
```json
{
  "id": 1,
  "userId": 2,
  "age": 25,
  "experience": 3,
  "hourlyRate": 1000,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа",
  "rating": 4.8,
  "reviewsCount": 15,
  "available": true,
  "user": {
    "id": 2,
    "firstName": "Мария",
    "lastName": "Петрова",
    "phone": "+79001234568",
    "email": "maria@example.com"
  },
  "schedules": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "18:00"
    }
  ]
}
```

### Создать/обновить профиль няни

**POST** `/babysitters` (создание)
**PUT** `/babysitters` (обновление)

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Body:**
```json
{
  "age": 25,
  "experience": 3,
  "hourlyRate": 1000,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа"
}
```

**Response (200/201):**
```json
{
  "id": 1,
  "age": 25,
  "experience": 3,
  "hourlyRate": 1000,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа"
}
```

---

## Бронирования

### Создать бронирование

**POST** `/bookings`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Body:**
```json
{
  "babysitterId": 1,
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T14:00:00.000Z",
  "childrenCount": 2,
  "childrenAges": [5, 8],
  "notes": "Дети любят играть на улице"
}
```

**Response (201):**
```json
{
  "id": 1,
  "parentId": 1,
  "babysitterId": 1,
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T14:00:00.000Z",
  "status": "pending",
  "childrenCount": 2,
  "childrenAges": [5, 8],
  "notes": "Дети любят играть на улице",
  "totalPrice": 4000,
  "createdAt": "2024-01-10T12:00:00.000Z",
  "babysitter": {
    "id": 1,
    "user": {
      "firstName": "Мария",
      "lastName": "Петрова"
    }
  }
}
```

### Получить мои бронирования

**GET** `/bookings?status=pending&page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (string, optional) - фильтр по статусу: `pending`, `confirmed`, `completed`, `cancelled`
- `page` (number, optional)
- `limit` (number, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "parentId": 1,
      "babysitterId": 1,
      "startTime": "2024-01-15T10:00:00.000Z",
      "endTime": "2024-01-15T14:00:00.000Z",
      "status": "pending",
      "totalPrice": 4000,
      "babysitter": {
        "id": 1,
        "user": {
          "firstName": "Мария",
          "lastName": "Петрова"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### Получить детали бронирования

**GET** `/bookings/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "parentId": 1,
  "babysitterId": 1,
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T14:00:00.000Z",
  "status": "pending",
  "childrenCount": 2,
  "childrenAges": [5, 8],
  "notes": "Дети любят играть на улице",
  "totalPrice": 4000,
  "createdAt": "2024-01-10T12:00:00.000Z",
  "parent": {
    "id": 1,
    "user": {
      "firstName": "Иван",
      "lastName": "Иванов"
    }
  },
  "babysitter": {
    "id": 1,
    "user": {
      "firstName": "Мария",
      "lastName": "Петрова"
    }
  }
}
```

### Обновить статус бронирования

**PUT** `/bookings/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "confirmed" | "cancelled"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "confirmed",
  "updatedAt": "2024-01-11T10:00:00.000Z"
}
```

---

## Расписания

### Получить расписание няни

**GET** `/schedules?babysitterId=1`

**Query Parameters:**
- `babysitterId` (number, required) - ID няни

**Response (200):**
```json
{
  "babysitterId": 1,
  "schedules": [
    {
      "id": 1,
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "id": 2,
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "18:00"
    }
  ]
}
```

**Примечание:** `dayOfWeek` - число от 0 (воскресенье) до 6 (суббота)

### Добавить/обновить доступность

**POST** `/schedules` (создание)
**PUT** `/schedules/:id` (обновление)

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Body:**
```json
{
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "18:00"
}
```

**Response (200/201):**
```json
{
  "id": 1,
  "babysitterId": 1,
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "18:00"
}
```

### Удалить доступность

**DELETE** `/schedules/:id`

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Response (200):**
```json
{
  "message": "Расписание удалено"
}
```

---

## Админ-панель

Все админские endpoints требуют роль `admin` и токен в заголовке.

### Получить всех пользователей

**GET** `/admin/users?page=1&limit=10&role=parent`

**Query Parameters:**
- `page` (number, optional)
- `limit` (number, optional)
- `role` (string, optional) - фильтр по роли: `parent`, `babysitter`, `admin`
- `search` (string, optional) - поиск по email/имени

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "role": "parent",
      "firstName": "Иван",
      "lastName": "Иванов",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Получить детали пользователя

**GET** `/admin/users/:id`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "parent",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "bookings": [
    {
      "id": 1,
      "status": "completed",
      "startTime": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Обновить пользователя

**PUT** `/admin/users/:id`

**Body:**
```json
{
  "role": "parent" | "babysitter" | "admin",
  "isActive": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "role": "parent",
  "isActive": true
}
```

### Удалить/забанить пользователя

**DELETE** `/admin/users/:id`

**Response (200):**
```json
{
  "message": "Пользователь удален"
}
```

### Получить все бронирования

**GET** `/admin/bookings?status=pending&page=1&limit=10`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "parentId": 1,
      "babysitterId": 1,
      "status": "pending",
      "startTime": "2024-01-15T10:00:00.000Z",
      "endTime": "2024-01-15T14:00:00.000Z",
      "totalPrice": 4000,
      "parent": {
        "user": {
          "firstName": "Иван",
          "lastName": "Иванов"
        }
      },
      "babysitter": {
        "user": {
          "firstName": "Мария",
          "lastName": "Петрова"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Статистика платформы

**GET** `/admin/stats`

**Response (200):**
```json
{
  "totalUsers": 150,
  "totalParents": 100,
  "totalBabysitters": 50,
  "totalBookings": 200,
  "pendingBookings": 10,
  "completedBookings": 180,
  "cancelledBookings": 10,
  "totalRevenue": 500000,
  "averageBookingPrice": 2500
}
```

---

## WebSocket (Реал-тайм уведомления)

### Подключение

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### События для прослушивания

#### Новое бронирование

**Событие:** `booking:created`

**Данные:**
```json
{
  "booking": {
    "id": 1,
    "parentId": 1,
    "babysitterId": 1,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "status": "pending",
    "totalPrice": 4000
  },
  "message": "Новое бронирование от Ивана Иванова"
}
```

**Пример использования:**
```javascript
socket.on('booking:created', (data) => {
  console.log('Новое бронирование:', data.booking);
  // Показать уведомление пользователю
});
```

#### Изменение статуса бронирования

**Событие:** `booking:status_changed`

**Данные:**
```json
{
  "bookingId": 1,
  "oldStatus": "pending",
  "newStatus": "confirmed",
  "booking": {
    "id": 1,
    "status": "confirmed",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z"
  }
}
```

**Пример использования:**
```javascript
socket.on('booking:status_changed', (data) => {
  console.log(`Бронирование ${data.bookingId} изменило статус с ${data.oldStatus} на ${data.newStatus}`);
  // Обновить UI
});
```

#### Новое уведомление

**Событие:** `notification:new`

**Данные:**
```json
{
  "id": 1,
  "type": "booking" | "message" | "system",
  "title": "Новое бронирование",
  "message": "У вас новое бронирование на 15 января",
  "read": false,
  "createdAt": "2024-01-10T12:00:00.000Z"
}
```

**Пример использования:**
```javascript
socket.on('notification:new', (notification) => {
  console.log('Новое уведомление:', notification);
  // Показать уведомление в UI
});
```

#### Подключение пользователя

**Событие:** `user:connected`

**Данные:**
```json
{
  "userId": 1,
  "timestamp": "2024-01-10T12:00:00.000Z"
}
```

#### Отключение пользователя

**Событие:** `user:disconnected`

**Данные:**
```json
{
  "userId": 1,
  "timestamp": "2024-01-10T12:00:00.000Z"
}
```

### Отправка событий (если нужно)

#### Отметить уведомление как прочитанное

**Событие:** `notification:read`

**Данные:**
```json
{
  "notificationId": 1
}
```

**Пример:**
```javascript
socket.emit('notification:read', { notificationId: 1 });
```

---

## Коды ошибок

### Стандартные HTTP коды

- `200` - Успешно
- `201` - Создано
- `400` - Неверный запрос
- `401` - Не авторизован (нет токена или токен невалидный)
- `403` - Доступ запрещен (недостаточно прав)
- `404` - Не найдено
- `409` - Конфликт (например, бронирование уже существует)
- `500` - Внутренняя ошибка сервера

### Формат ошибки

```json
{
  "statusCode": 400,
  "message": "Неверные данные",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email должен быть валидным"
    }
  ]
}
```

---

## Примеры использования

### React Hook для API

```typescript
import { useState, useEffect } from 'react';

function useBookings(token: string) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.data);
        setLoading(false);
      });
  }, [token]);

  return { bookings, loading };
}
```

### React Hook для WebSocket

```typescript
import { useEffect } from 'react';
import io from 'socket.io-client';

function useNotifications(token: string) {
  useEffect(() => {
    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socket.on('booking:created', (data) => {
      console.log('Новое бронирование:', data);
    });

    socket.on('booking:status_changed', (data) => {
      console.log('Статус изменен:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);
}
```

---

## Swagger документация

Интерактивная документация API доступна по адресу:

```
http://localhost:3000/api/docs
```

В Swagger UI вы можете:
- Просмотреть все endpoints
- Увидеть схемы запросов и ответов
- Протестировать API прямо в браузере
- Авторизоваться через JWT токен

---

## Типы данных

### Роли пользователей

- `parent` - родитель
- `babysitter` - няня
- `admin` - администратор

### Статусы бронирования

- `pending` - ожидает подтверждения
- `confirmed` - подтверждено
- `completed` - завершено
- `cancelled` - отменено

### Дни недели (dayOfWeek)

- `0` - Воскресенье
- `1` - Понедельник
- `2` - Вторник
- `3` - Среда
- `4` - Четверг
- `5` - Пятница
- `6` - Суббота

---

## Примечания

1. **JWT токены** имеют срок действия (обычно 24 часа). После истечения нужно обновить токен через `/auth/login` или `/auth/refresh` (если будет реализовано).

2. **Пагинация** используется для списков. Всегда проверяйте поле `meta` для навигации.

3. **Валидация** выполняется на сервере. Всегда обрабатывайте ошибки валидации (код 400).

4. **WebSocket** автоматически переподключается при разрыве соединения.

5. **CORS** настроен для работы с фронтендом. Убедитесь, что ваш домен разрешен на бэкенде.

6. **Время** всегда в формате ISO 8601 (UTC): `2024-01-15T10:00:00.000Z`

