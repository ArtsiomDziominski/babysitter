# API Документация для Frontend разработчика

## Базовый URL

```
http://localhost:3000
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
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

**Примечание:** Роль в запросе не передается (по умолчанию `null`). Чтобы выбрать `parent` или `babysitter`, используйте endpoint `PATCH /users/profile/role`.

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": null,
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

### Изменение email

Процесс изменения email состоит из двух шагов: запрос кода и подтверждение.

#### Запрос на изменение email

**POST** `/auth/change-email/request`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "message": "Код подтверждения отправлен на новый email"
}
```

**Примечание:** Код подтверждения отправляется на **новый** email адрес. Код действителен 15 минут.

#### Подтверждение изменения email

**POST** `/auth/change-email/confirm`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "newEmail": "newemail@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "role": "parent",
  "firstName": "Иван",
  "lastName": "Иванов",
  ...
}
```

**Ошибки:**
- `400 Bad Request` - неверный код или код истек
- `400 Bad Request` - новый email уже занят
- `400 Bad Request` - новый email совпадает с текущим

### Изменение пароля

Процесс изменения пароля состоит из двух шагов: запрос кода и подтверждение.

#### Запрос на изменение пароля

**POST** `/auth/change-password/request`

**Headers:** `Authorization: Bearer <token>`

**Body:** (пустой объект)

**Response (200):**
```json
{
  "message": "Код подтверждения отправлен на email"
}
```

**Примечание:** Код подтверждения отправляется на email пользователя. Код действителен 15 минут.

#### Подтверждение изменения пароля

**POST** `/auth/change-password/confirm`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**Поля:**
- `code` (string, **обязательное**) - код подтверждения из email
- `newPassword` (string, **обязательное**) - новый пароль (минимум 8 символов)

**Response (200):**
```json
{
  "message": "Пароль успешно изменен"
}
```

**Ошибки:**
- `400 Bad Request` - неверный код или код истек
- `400 Bad Request` - пароль слишком короткий (меньше 8 символов)

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
  "avatar": "avatars/1-1704067200000.jpg",
  "twoFactorEnabled": false,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "children": [
    {
      "id": 1,
      "parentId": 1,
      "name": "Мария",
      "age": 5,
      "dateOfBirth": "2019-01-15",
      "specialNeeds": null,
      "allergies": "Орехи",
      "notes": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Примечания:**
- Поле `avatar` содержит ключ файла в MinIO. Для получения URL используйте endpoint `GET /users/profile/avatar` или, если настроен публичный доступ, напрямую: `http://localhost:9000/{avatar}`
- Поле `role` может быть `null`, `"parent"`, `"babysitter"` или `"admin"`
- Поле `children` - массив детей пользователя (заполняется только для роли `parent`)

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

### Установить роль пользователя

**PATCH** `/users/profile/role`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "role": "parent" | "babysitter"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "babysitter",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

**Ошибки:**
- `400 Bad Request` - роль должна быть `parent` или `babysitter`
- `401 Unauthorized` - отсутствует/невалидный токен

### Загрузить аватар

**POST** `/users/profile/avatar`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (FormData):**
```
avatar: <File>
```

**Ограничения:**
- Формат: `jpg`, `jpeg`, `png`, `webp`
- Размер: до 5MB

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "avatar": "avatars/1-1704067200000.jpg",
  ...
}
```

### Получить аватар

**GET** `/users/profile/avatar`

**Headers:** `Authorization: Bearer <token>`

**Response:** Редирект (302) на presigned URL аватара из MinIO

**Обработка ошибок:**
- `404` - Аватар не найден

**Примечание:** Presigned URL действителен 1 час. Для прямого доступа к файлу (если настроен публичный доступ в MinIO) можно использовать: `http://localhost:9000/avatars/{avatar_key}` где `avatar_key` - значение поля `avatar` из профиля пользователя.

### Удалить аватар

**DELETE** `/users/profile/avatar`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "avatar": null,
  ...
}
```

---

## Доверенные лица

Все endpoints для работы с доверенными лицами доступны только для авторизованных пользователей. Родитель может указать до 10 доверенных лиц, которые могут быть контактами, если родитель недоступен.

### Получить список доверенных лиц

**GET** `/users/trusted-contacts`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "parentId": 1,
    "firstName": "Анна",
    "lastName": "Петрова",
    "phone": "+79001234568",
    "relationship": "Бабушка",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  },
  {
    "id": 2,
    "parentId": 1,
    "firstName": "Сергей",
    "lastName": "Иванов",
    "phone": "+79001234569",
    "relationship": "Дедушка",
    "createdAt": "2024-01-11T10:00:00.000Z",
    "updatedAt": "2024-01-11T10:00:00.000Z"
  }
]
```

### Добавить доверенное лицо

**POST** `/users/trusted-contacts`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Анна",
  "lastName": "Петрова",
  "phone": "+79001234568",
  "relationship": "Бабушка"
}
```

**Поля:**
- `firstName` (string, **обязательное**) - имя доверенного лица
- `lastName` (string, **обязательное**) - фамилия доверенного лица
- `phone` (string, **обязательное**) - телефон в формате E.164 (например, +79001234567)
- `relationship` (string, optional) - степень родства или связь (например, "Бабушка", "Дедушка", "Друг семьи")

**Response (201):**
```json
{
  "id": 1,
  "parentId": 1,
  "firstName": "Анна",
  "lastName": "Петрова",
  "phone": "+79001234568",
  "relationship": "Бабушка",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

**Ошибки:**
- `400 Bad Request` - если у родителя уже максимальное количество доверенных лиц (10)
- `400 Bad Request` - если телефон невалидный

### Получить детали доверенного лица

**GET** `/users/trusted-contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "parentId": 1,
  "firstName": "Анна",
  "lastName": "Петрова",
  "phone": "+79001234568",
  "relationship": "Бабушка",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - если доверенное лицо не найдено или не принадлежит текущему пользователю

### Обновить доверенное лицо

**PUT** `/users/trusted-contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Анна",
  "lastName": "Петрова-Иванова",
  "phone": "+79001234570",
  "relationship": "Бабушка"
}
```

Все поля опциональны. Можно обновить только нужные поля.

**Response (200):**
```json
{
  "id": 1,
  "parentId": 1,
  "firstName": "Анна",
  "lastName": "Петрова-Иванова",
  "phone": "+79001234570",
  "relationship": "Бабушка",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-12T14:30:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - если доверенное лицо не найдено или не принадлежит текущему пользователю
- `400 Bad Request` - если телефон невалидный

### Удалить доверенное лицо

**DELETE** `/users/trusted-contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Доверенное лицо удалено"
}
```

**Ошибки:**
- `404 Not Found` - если доверенное лицо не найдено или не принадлежит текущему пользователю

---

## Дети

Все endpoints для работы с детьми доступны только для пользователей с ролью `parent`.

### Получить список моих детей

**GET** `/children`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Response (200):**
```json
[
  {
    "id": 1,
    "parentId": 1,
    "name": "Мария",
    "age": 5,
    "dateOfBirth": "2019-03-15",
    "specialNeeds": null,
    "allergies": "Арахис",
    "notes": "Любит рисовать",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  },
  {
    "id": 2,
    "parentId": 1,
    "name": "Иван",
    "age": 8,
    "dateOfBirth": "2016-07-20",
    "specialNeeds": null,
    "allergies": null,
    "notes": null,
    "createdAt": "2024-01-11T10:00:00.000Z",
    "updatedAt": "2024-01-11T10:00:00.000Z"
  }
]
```

### Добавить ребенка

**POST** `/children`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Body:**
```json
{
  "name": "Мария",
  "age": 5,
  "dateOfBirth": "2019-03-15",
  "specialNeeds": null,
  "allergies": "Арахис",
  "notes": "Любит рисовать"
}
```

**Поля:**
- `name` (string, **обязательное**) - имя ребенка
- `age` (number, optional) - возраст (0-18)
- `dateOfBirth` (string, optional) - дата рождения в формате ISO (YYYY-MM-DD)
- `specialNeeds` (string, optional) - особые потребности
- `allergies` (string, optional) - аллергии
- `notes` (string, optional) - дополнительные заметки

**Response (201):**
```json
{
  "id": 1,
  "parentId": 1,
  "name": "Мария",
  "age": 5,
  "dateOfBirth": "2019-03-15",
  "specialNeeds": null,
  "allergies": "Арахис",
  "notes": "Любит рисовать",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

**Ошибки:**
- `400 Bad Request` - если у родителя уже максимальное количество детей (10)
- `400 Bad Request` - если возраст вне диапазона 0-18

### Получить детали ребенка

**GET** `/children/:id`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Response (200):**
```json
{
  "id": 1,
  "parentId": 1,
  "name": "Мария",
  "age": 5,
  "dateOfBirth": "2019-03-15",
  "specialNeeds": null,
  "allergies": "Арахис",
  "notes": "Любит рисовать",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - если ребенок не найден или не принадлежит текущему родителю

### Обновить информацию о ребенке

**PATCH** `/children/:id`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Body:**
```json
{
  "name": "Мария Иванова",
  "age": 6,
  "allergies": "Арахис, молоко"
}
```

Все поля опциональны. Можно обновить только нужные поля.

**Response (200):**
```json
{
  "id": 1,
  "parentId": 1,
  "name": "Мария Иванова",
  "age": 6,
  "dateOfBirth": "2019-03-15",
  "specialNeeds": null,
  "allergies": "Арахис, молоко",
  "notes": "Любит рисовать",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-12T14:30:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - если ребенок не найден или не принадлежит текущему родителю
- `400 Bad Request` - если возраст вне диапазона 0-18

### Удалить ребенка

**DELETE** `/children/:id`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Response (200):**
```json
{
  "message": "Ребенок удален"
}
```

**Ошибки:**
- `404 Not Found` - если ребенок не найден или не принадлежит текущему родителю

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
      "firstName": "Мария",
      "lastName": "Петрова",
      "age": 25,
      "experience": 3,
      "certifications": ["CPR", "First Aid"],
      "bio": "Опытная няня с 3 годами стажа",
      "cardPaymentAvailable": true,
      "minOrderAmount": "1000",
      "priceOneChild": "700",
      "priceTwoChildren": "1200",
      "priceThreeChildren": "1500",
      "priceFourChildren": "1800",
      "priceFiveChildren": "2000",
      "onlineLesson": "800",
      "cancellationPolicy": "Отмена за 24 часа без штрафа",
      "infantCare": true,
      "specialNeedsCare": true,
      "petAttitude": "Комфортно с животными",
      "advantages": ["Мед образование", "Английский"],
      "birthDate": "1999-05-01",
      "rating": 4.8,
      "reviewsCount": 15,
      "showInSearch": true,
      "isOnline": true,
      "avatarUrl": "https://..."
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

### Получить свой профиль няни

**GET** `/babysitters/profile`

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Response (200):**
```json
{
  "id": 1,
  "userId": 2,
  "firstName": "Мария",
  "lastName": "Петрова",
  "birthDate": "1999-05-01",
  "experience": 3,
  "hourlyRate": 700,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа",
  "rating": 4.8,
  "reviewsCount": 15,
  "available": true,
  "showInSearch": true,
  "isOnline": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "schedules": [
    {
      "mode": "weekly",
      "isRecurring": true,
      "schedules": [
        {
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ],
          "isRecurring": true
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "isRecurring": false,
      "schedules": [
        {
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

**Ошибки:**
- `404 Not Found` - профиль няни не найден
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - недостаточно прав (требуется роль `babysitter`)

**Примечания:**
- Эндпоинт возвращает полный профиль няни с информацией о пользователе и расписанием
- Поле `schedules` содержит отформатированное расписание в виде блоков с разными режимами (`weekly`, `everyday`, `allDays`)

### Получить детали няни

**GET** `/babysitters/:id`

**Response (200):**
```json
{
  "id": 1,
  "userId": 2,
  "firstName": "Мария",
  "lastName": "Петрова",
  "age": 25,
  "experience": 3,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа",
  "cardPaymentAvailable": true,
  "minOrderAmount": "1000",
  "priceOneChild": "700",
  "priceTwoChildren": "1200",
  "priceThreeChildren": "1500",
  "priceFourChildren": "1800",
  "priceFiveChildren": "2000",
  "onlineLesson": "800",
  "cancellationPolicy": "Отмена за 24 часа без штрафа",
  "infantCare": true,
  "specialNeedsCare": true,
  "petAttitude": "Комфортно с животными",
  "advantages": ["Мед образование", "Английский"],
  "birthDate": "1999-05-01",
      "rating": 4.8,
      "reviewsCount": 15,
      "available": true,
      "showInSearch": true,
      "isOnline": true,
      "avatarUrl": "https://...",
      "schedules": [
    {
      "mode": "weekly",
      "schedules": [
        {
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

### Создать/обновить профиль няни

**POST** `/babysitters` (создание)
**PUT** `/babysitters` (обновление)

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

Поле `schedules` — массив блоков расписания. Каждый блок содержит:
- `mode`: `weekly` | `everyday` | `allDays`
- `schedules`: массив интервалов:
  - для `weekly` — элементы с `dayOfWeek` (0—6, где 0 — воскресенье) и `intervals` (список `{ "startTime": "HH:MM", "endTime": "HH:MM" }`)
  - для `everyday` — элементы с `date` в формате `YYYY-MM-DD` и `intervals`
  - для `allDays` — общий список интервалов без `dayOfWeek`/`date` (применяется ко всем дням)

Во всех режимах можно указывать несколько интервалов в день.

Поля запроса:
- `firstName` — имя (обновляет профиль пользователя).
- `lastName` — фамилия (обновляет профиль пользователя).
- `age` — возраст (число).
- `experience` — стаж в годах (число).
- `certifications` — массив сертификатов.
- `bio` — краткое описание.
- `cardPaymentAvailable` — принимает оплату на карту (`true`/`false`).
- `minOrderAmount` — минимальная сумма заказа (строка с числом).
- `priceOneChild` ... `priceFiveChildren` — цена для 1–5 детей (строки с числом).
- `onlineLesson` — цена онлайн-занятия (строка с числом).
- `cancellationPolicy` — правила отмен/опозданий.
- `infantCare` — берёт младенцев (`true`/`false`).
- `specialNeedsCare` — берёт особенных детей (`true`/`false`).
- `petAttitude` — отношение к животным.
- `advantages` — массив преимуществ.
- `birthDate` — дата рождения в формате `YYYY-MM-DD`.
- `showInSearch` (boolean, optional) — показывать профиль в поиске (по умолчанию `false`).

**Body:**
```json
{
  "age": 25,
  "experience": 3,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа",
  "firstName": "Мария",
  "lastName": "Петрова",
  "cardPaymentAvailable": true,
  "minOrderAmount": "1000",
  "priceOneChild": "700",
  "priceTwoChildren": "1200",
  "priceThreeChildren": "1500",
  "priceFourChildren": "1800",
  "priceFiveChildren": "2000",
  "onlineLesson": "800",
  "cancellationPolicy": "Отмена за 24 часа без штрафа",
  "infantCare": true,
  "specialNeedsCare": true,
  "petAttitude": "Комфортно с животными",
  "advantages": ["Мед образование", "Английский"],
  "birthDate": "1999-05-01",
  "showInSearch": true,
  "schedules": [
    {
      "mode": "weekly",
      "schedules": [
        {
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        },
        {
          "dayOfWeek": 3,
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

**Response (200/201):**
```json
{
  "id": 1,
  "age": 25,
  "experience": 3,
  "certifications": ["CPR", "First Aid"],
  "bio": "Опытная няня с 3 годами стажа",
  "cardPaymentAvailable": true,
  "minOrderAmount": "1000",
  "priceOneChild": "700",
  "priceTwoChildren": "1200",
  "priceThreeChildren": "1500",
  "priceFourChildren": "1800",
  "priceFiveChildren": "2000",
  "onlineLesson": "800",
  "cancellationPolicy": "Отмена за 24 часа без штрафа",
  "infantCare": true,
  "specialNeedsCare": true,
  "petAttitude": "Комфортно с животными",
  "advantages": ["Мед образование", "Английский"],
  "birthDate": "1999-05-01",
  "showInSearch": true,
  "schedules": [
    {
      "mode": "weekly",
      "schedules": [
        {
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        },
        {
          "dayOfWeek": 3,
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

### Удалить профиль няни

**DELETE** `/babysitters`

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Response (200):**
```json
{
  "message": "Профиль няни успешно удален"
}
```

**Ошибки:**
- `404 Not Found` - если профиль няни не найден
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - недостаточно прав (требуется роль `babysitter`)

**Примечание:** При удалении профиля няни также удаляются все связанные расписания (schedules), а роль пользователя сбрасывается на `null`.

### Активировать/деактивировать профиль в поиске

**PATCH** `/babysitters/search-visibility`

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Body:**
```json
{
  "showInSearch": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "userId": 2,
  "showInSearch": true,
  "isOnline": true,
  "available": true,
  "rating": 4.8,
  "reviewsCount": 15,
  ...
}
```

**Ошибки:**
- `404 Not Found` - если профиль няни не найден
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - недостаточно прав (требуется роль `babysitter`)

**Примечание:** 
- Если `showInSearch = false`, профиль не будет отображаться в результатах поиска (`GET /babysitters`)
- Если `showInSearch = true`, профиль будет виден в поиске (при условии, что `available = true`)

---

## Бронирования

### Создать бронирование

**POST** `/bookings`

**Headers:** `Authorization: Bearer <token>` (требуется роль `parent`)

**Body:**
```json
{
  "babysitterId": 9,
  "startTime": "2025-12-23T06:00:00.000Z",
  "endTime": "2025-12-23T10:00:00.000Z",
  "childrenCount": 1,
  "children": [
    {
      "name": "Мария",
      "age": 5.5,
      "description": "Любит рисовать"
    }
  ],
  "bookingType": "offline",
  "childIsSick": false,
  "hasSpecialNeedsChild": false,
  "needsHelpWithHomework": true,
  "needsOutdoorActivities": true,
  "needsCarTransportation": true,
  "needsWalking": false,
  "notes": "Нужна помощь с уроками, Нужны прогулки на улице, Нужно свозить на машине (в кружок, секцию и т.д.). Хороший реб"
}
```

**Поля:**
- `babysitterId` (number, **обязательное**) - ID няни
- `startTime` (string, **обязательное**) - время начала в формате ISO 8601
- `endTime` (string, **обязательное**) - время окончания в формате ISO 8601
- `childrenCount` (number, optional) - количество детей (по умолчанию: 1). Если передано поле `children`, то `childrenCount` вычисляется автоматически как длина массива `children`
- `children` (array, optional) - массив объектов с информацией о детях. Каждый объект содержит:
  - `name` (string, **обязательное**) - имя ребенка
  - `age` (number, **обязательное**) - возраст ребенка (0-18), может быть десятичным (например, 5.5)
  - `description` (string, optional) - описание/заметки о ребенке
- `bookingType` (string, optional) - тип бронирования: `"offline"` или `"online"` (по умолчанию: `"offline"`)
- `childIsSick` (boolean, optional) - ребенок болен (по умолчанию: `false`)
- `hasSpecialNeedsChild` (boolean, optional) - есть ребенок с особыми потребностями (по умолчанию: `false`)
- `needsHelpWithHomework` (boolean, optional) - нужна помощь с уроками (по умолчанию: `false`)
- `needsOutdoorActivities` (boolean, optional) - нужны прогулки на улице (по умолчанию: `false`)
- `needsCarTransportation` (boolean, optional) - нужна перевозка на машине (по умолчанию: `false`)
- `needsWalking` (boolean, optional) - нужны прогулки пешком (по умолчанию: `false`)
- `notes` (string, optional) - дополнительные заметки

**Response (201):**
```json
{
  "id": 1,
  "parentId": 1,
  "babysitterId": 9,
  "startTime": "2025-12-23T06:00:00.000Z",
  "endTime": "2025-12-23T10:00:00.000Z",
  "status": "pending",
  "childrenCount": 1,
  "children": [
    {
      "name": "Мария",
      "age": 5.5,
      "description": "Любит рисовать"
    }
  ],
  "bookingType": "offline",
  "childIsSick": false,
  "hasSpecialNeedsChild": false,
  "needsHelpWithHomework": true,
  "needsOutdoorActivities": true,
  "needsCarTransportation": true,
  "needsWalking": false,
  "notes": "Нужна помощь с уроками, Нужны прогулки на улице, Нужно свозить на машине (в кружок, секцию и т.д.). Хороший реб",
  "totalPrice": 4000,
  "createdAt": "2024-01-10T12:00:00.000Z",
  "babysitter": {
    "id": 9,
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
- `status` (string, optional) - фильтр по статусу: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`
- `page` (number, optional)
- `limit` (number, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "customer": {
        "name": "Мария Петрова",
        "phone": "+79001234567"
      },
      "date": "2024-01-15",
      "time": "10:00 - 14:00",
      "children": ["Мария", "Иван"],
      "status": "pending",
      "totalPrice": 4000,
      "startTime": "2024-01-15T10:00:00.000Z",
      "endTime": "2024-01-15T14:00:00.000Z",
      "childrenCount": 2,
      "children": [
        {
          "name": "Мария",
          "age": 5,
          "description": "Любит играть на улице"
        },
        {
          "name": "Иван",
          "age": 8
        }
      ],
      "bookingType": "offline",
      "childIsSick": false,
      "hasSpecialNeedsChild": false,
      "needsHelpWithHomework": true,
      "needsOutdoorActivities": true,
      "needsCarTransportation": false,
      "needsWalking": false,
      "notes": "Дети любят играть на улице",
      "createdAt": "2024-01-10T12:00:00.000Z",
      "parentReviewId": 1,
      "babysitterReviewId": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

**Поля отзывов:**
- `parentReviewId` (number | null) - ID отзыва от родителя о няне, или `null`, если отзыв не оставлен
- `babysitterReviewId` (number | null) - ID отзыва от няни о родителе, или `null`, если отзыв не оставлен

**Примечания:**
- Поле `customer` содержит информацию о контрагенте:
  - Для родителя (`parent`) - данные няни
  - Для няни (`babysitter`) - данные родителя
- Поле `date` - дата в формате YYYY-MM-DD
- Поле `time` - время в формате "HH:MM - HH:MM"
- Поле `children` - массив объектов с информацией о детях (name, age, description) или массив имен детей (для обратной совместимости)
- Все новые поля бронирования включены в ответ

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
  "children": [
    {
      "name": "Мария",
      "age": 5,
      "description": "Любит играть на улице"
    },
    {
      "name": "Иван",
      "age": 8
    }
  ],
  "bookingType": "offline",
  "childIsSick": false,
  "hasSpecialNeedsChild": false,
  "needsHelpWithHomework": true,
  "needsOutdoorActivities": true,
  "needsCarTransportation": false,
  "needsWalking": false,
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

**PATCH** `/bookings/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "confirmed" | "in_progress" | "completed" | "cancelled"
}
```

**Права доступа:**
- **Родитель** (`parent`) может только отменить бронирование: `"status": "cancelled"` (если статус не `completed`)
- **Няня** (`babysitter`) может выполнять следующие переходы:
  - `pending` → `confirmed` (подтвердить)
  - `pending` → `cancelled` (отменить)
  - `confirmed` → `cancelled` (отменить)
  - `confirmed` → `in_progress` (начать работу)
  - `in_progress` → `completed` (завершить)
  - `in_progress` → `cancelled` (отменить)

**Response (200):**
```json
{
  "id": 1,
  "status": "in_progress",
  "updatedAt": "2024-01-11T10:00:00.000Z"
}
```

**Ошибки:**
- `400 Bad Request` - недопустимое изменение статуса (например, попытка перевести `pending` сразу в `completed`)
- `403 Forbidden` - недостаточно прав (например, родитель пытается установить статус `in_progress`)

### Автоматическая смена статусов

Система автоматически меняет статусы бронирований каждую минуту через cron-задачу. Это происходит без участия пользователей.

**Как это работает:**
- Cron-задача запускается каждую минуту автоматически
- Проверяются все бронирования и при необходимости меняются их статусы
- При изменении статуса отправляются уведомления родителю и няне через WebSocket (`booking:status_changed`)

**Автоматические переходы статусов:**

1. **`pending` → `cancelled`** (автоматическая отмена)
   
   Заказ автоматически отменяется в двух случаях:
   
   **a) Прошло 4 часа с момента создания заказа:**
   - Условие: `createdAt <= (текущее время - 4 часа)`
   - Пример: Заказ создан в 10:00, в 14:01 он будет отменен
   
   **b) Время начала работы уже прошло:**
   - Условие: `startTime <= текущее время`
   - Пример: Заказ на 10:00, если в 10:01 он все еще в статусе `pending`, он будет отменен
   
   **Примечание:** Оба условия проверяются независимо. Если заказ не подтвержден и время начала прошло, он отменяется независимо от того, прошло 4 часа или нет.

2. **`confirmed` → `in_progress`** (автоматическое начало работы)
   
   - Условие: `status = confirmed` И `startTime <= текущее время`
   - Пример: Заказ подтвержден на 10:00, в 10:01 он автоматически переходит в `in_progress`
   - Отправляются уведомления родителю и няне

3. **`in_progress` → `completed`** (автоматическое завершение)
   
   - Условие: `status = in_progress` И `endTime <= текущее время`
   - Пример: Заказ должен закончиться в 14:00, в 14:01 он автоматически переходит в `completed`
   - Отправляются уведомления родителю и няне

**Важные моменты:**

- **Работает даже после перезапуска сервера:** Если сервер был выключен, при следующем запуске cron найдет все просроченные заказы и обновит их статусы
- **Проверка по абсолютному времени:** Система проверяет время создания/начала/окончания относительно текущего времени, а не времени последнего запуска cron
- **Уведомления:** При каждом автоматическом изменении статуса отправляются WebSocket уведомления (`booking:status_changed`)
- **Настройка:** Время для автоматической отмены (по умолчанию 4 часа) можно настроить в конфигурации сервера

**Примеры сценариев:**

**Сценарий 1: Заказ не подтвержден в течение 4 часов**
```
10:00 - Заказ создан (status: pending)
14:01 - Заказ автоматически отменен (status: cancelled)
```

**Сценарий 2: Заказ не подтвержден, время начала прошло**
```
10:00 - Заказ создан на 12:00 (status: pending)
12:01 - Заказ автоматически отменен (status: cancelled), даже если прошло только 2 часа
```

**Сценарий 3: Заказ подтвержден, время начала наступило**
```
10:00 - Заказ создан на 12:00 (status: pending)
10:30 - Няня подтвердила (status: confirmed)
12:01 - Заказ автоматически начался (status: in_progress)
```

**Сценарий 4: Заказ завершен**
```
10:00 - Заказ создан на 12:00-14:00 (status: pending)
10:30 - Няня подтвердила (status: confirmed)
12:01 - Заказ автоматически начался (status: in_progress)
14:01 - Заказ автоматически завершен (status: completed)
```

**Сценарий 5: Сервер был выключен**
```
10:00 - Заказ создан на 12:00 (status: pending)
11:00 - Сервер выключен
16:00 - Сервер включен
16:01 - Cron находит заказ, время начала (12:00) уже прошло, заказ отменен (status: cancelled)
```

---

## Отзывы

### Создать или обновить отзыв (upsert)

**POST** `/reviews`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "bookingId": 1,
  "targetId": 2,
  "targetType": "babysitter" | "parent",
  "rating": 5,
  "comment": "Отличная няня! Очень ответственная и внимательная."
}
```

**Response (200 или 201):**
```json
{
  "id": 1,
  "bookingId": 1,
  "authorId": 1,
  "targetId": 2,
  "targetType": "babysitter",
  "rating": 5,
  "comment": "Отличная няня! Очень ответственная и внимательная.",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "author": {
    "id": 1,
    "firstName": "Иван",
    "lastName": "Иванов",
    "avatar": "https://..."
  },
  "target": {
    "id": 2,
    "firstName": "Мария",
    "lastName": "Петрова"
  }
}
```

**Ошибки:**
- `404 Not Found` - бронирование не найдено
- `400 Bad Request` - бронирование не завершено, неверный targetId или targetType
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - вы не можете оставить отзыв для этого бронирования

**Примечания:**
- Отзыв можно оставить только для завершенного бронирования (status = `completed`)
- Нельзя оставить отзыв, если прошло больше недели с момента завершения бронирования
- Родитель может оставить отзыв только о няне (`targetType: "babysitter"`)
- Няня может оставить отзыв только о родителе (`targetType: "parent"`)
- Если отзыв от этого автора для этого бронирования уже существует - он будет обновлен
- Для каждого бронирования можно редактировать отзыв не более 3 раз
- Рейтинг должен быть от 1 до 5
- Комментарий опционален

### Получить список отзывов

**GET** `/reviews`

**Headers:** `Authorization: Bearer <token>`

**Query параметры:**
- `targetId` (опционально) - ID цели отзыва (няня или родитель)
- `targetType` (опционально) - тип цели: `babysitter` | `parent`
- `bookingId` (опционально) - ID бронирования
- `authorId` (опционально) - ID автора отзыва
- `page` (опционально, по умолчанию 1) - номер страницы
- `limit` (опционально, по умолчанию 10) - количество на странице

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "authorId": 1,
      "targetId": 2,
      "targetType": "babysitter",
      "rating": 5,
      "comment": "Отличная няня!",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "author": {
        "id": 1,
        "firstName": "Иван",
        "lastName": "Иванов",
        "avatar": "https://..."
      },
      "target": {
        "id": 2,
        "firstName": "Мария",
        "lastName": "Петрова"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Примеры запросов:**
- Получить все отзывы о няне: `GET /reviews?targetId=2&targetType=babysitter`
- Получить все отзывы родителя: `GET /reviews?targetId=1&targetType=parent`
- Получить отзывы по бронированию: `GET /reviews?bookingId=1`

### Получить детали отзыва

**GET** `/reviews/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "bookingId": 1,
  "authorId": 1,
  "targetId": 2,
  "targetType": "babysitter",
  "rating": 5,
  "comment": "Отличная няня!",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "author": {
    "id": 1,
    "firstName": "Иван",
    "lastName": "Иванов",
    "avatar": "https://..."
  },
  "target": {
    "id": 2,
    "firstName": "Мария",
    "lastName": "Петрова"
  },
  "booking": {
    "id": 1,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "status": "completed"
  }
}
```

**Ошибки:**
- `404 Not Found` - отзыв не найден
- `401 Unauthorized` - отсутствует/невалидный токен

### Получить отзывы по бронированию

**GET** `/reviews/booking/:bookingId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "bookingId": 1,
    "authorId": 1,
    "targetId": 2,
    "targetType": "babysitter",
    "rating": 5,
    "comment": "Отличная няня!",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "author": {
      "id": 1,
      "firstName": "Иван",
      "lastName": "Иванов"
    },
    "target": {
      "id": 2,
      "firstName": "Мария",
      "lastName": "Петрова"
    }
  },
  {
    "id": 2,
    "bookingId": 1,
    "authorId": 2,
    "targetId": 1,
    "targetType": "parent",
    "rating": 5,
    "comment": "Отличный родитель!",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "author": {
      "id": 2,
      "firstName": "Мария",
      "lastName": "Петрова"
    },
    "target": {
      "id": 1,
      "firstName": "Иван",
      "lastName": "Иванов"
    }
  }
]
```

**Ошибки:**
- `401 Unauthorized` - отсутствует/невалидный токен

### Обновить отзыв

**PATCH** `/reviews/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 4,
  "comment": "Обновленный комментарий"
}
```

**Response (200):**
```json
{
  "id": 1,
  "bookingId": 1,
  "authorId": 1,
  "targetId": 2,
  "targetType": "babysitter",
  "rating": 4,
  "comment": "Обновленный комментарий",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - отзыв не найден
- `400 Bad Request` - неверный рейтинг (должен быть от 1 до 5)
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - вы можете редактировать только свои отзывы

**Примечания:**
- Можно обновить только свой отзыв
- Можно обновить только `rating` и/или `comment`
- Можно редактировать отзыв не более 3 раз для одного бронирования
- Нельзя редактировать отзыв, если прошло больше недели с момента завершения бронирования
- При изменении рейтинга автоматически пересчитывается средний рейтинг цели отзыва
- Для каждого нового бронирования счетчик редактирований обнуляется (независимый для каждого заказа)

### Удалить отзыв

**DELETE** `/reviews/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Отзыв удален"
}
```

**Ошибки:**
- `404 Not Found` - отзыв не найден
- `401 Unauthorized` - отсутствует/невалидный токен
- `403 Forbidden` - вы можете удалять только свои отзывы

**Примечания:**
- Можно удалить только свой отзыв
- После удаления автоматически пересчитывается средний рейтинг цели отзыва

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
      "mode": "weekly",
      "schedules": [
        {
          "id": 1,
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        },
        {
          "id": 2,
          "dayOfWeek": 2,
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "id": 3,
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "id": 4,
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

**Примечание:**  
- `mode`: `weekly` | `everyday` | `allDays`  
- для `weekly` используйте `dayOfWeek` 0–6 (0 — воскресенье); для `everyday` — `date` в формате `YYYY-MM-DD`; для `allDays` интервалы без `dayOfWeek`/`date` применяются ко всем дням.  
- время в интервалах — `HH:MM`.

### Добавить/обновить доступность

**POST** `/schedules` (создание)
**PUT** `/schedules/:id` (обновление)

**Headers:** `Authorization: Bearer <token>` (требуется роль `babysitter`)

**Body:**
```json
{
  "schedules": [
    {
      "mode": "weekly",
      "schedules": [
        {
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
}
```

**Response (200/201):**
```json
{
  "babysitterId": 1,
  "schedules": [
    {
      "mode": "weekly",
      "schedules": [
        {
          "id": 1,
          "dayOfWeek": 1,
          "intervals": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        }
      ]
    },
    {
      "mode": "everyday",
      "schedules": [
        {
          "id": 3,
          "date": "2024-05-01",
          "intervals": [
            { "startTime": "10:00", "endTime": "16:00" }
          ]
        }
      ]
    },
    {
      "mode": "allDays",
      "schedules": [
        {
          "id": 4,
          "intervals": [
            { "startTime": "08:00", "endTime": "20:00" }
          ]
        }
      ]
    }
  ]
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
    "endTime": "2024-01-15T14:00:00.000Z",
    "childrenCount": 2,
    "bookingType": "offline",
    "totalPrice": 4000
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

#### Обновление бронирования

**Событие:** `booking:updated`

**Данные:**
```json
{
  "booking": {
    "id": 1,
    "status": "confirmed",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "childrenCount": 2,
    "bookingType": "offline",
    "notes": "Обновленные заметки",
    "totalPrice": 4000
  },
  "message": "Бронирование было обновлено"
}
```

**Примечание:** Это событие отправляется при любых изменениях в бронировании, кроме изменения статуса (для изменения статуса используется `booking:status_changed`).

**Пример использования:**
```javascript
socket.on('booking:updated', (data) => {
  console.log('Бронирование обновлено:', data.booking);
  // Обновить UI с новыми данными
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
    fetch('http://localhost:3000/bookings', {
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
http://localhost:3000/docs
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
  - Автоматически переходит в `cancelled`, если:
    - Прошло 4 часа с момента создания, ИЛИ
    - Время начала работы (`startTime`) уже прошло
- `confirmed` - подтверждено
  - Автоматически переходит в `in_progress`, когда наступает время начала (`startTime`)
- `in_progress` - в процессе выполнения
  - Автоматически переходит в `completed`, когда наступает время окончания (`endTime`)
- `completed` - завершено
  - Финальный статус, не меняется автоматически
- `cancelled` - отменено
  - Финальный статус, не меняется автоматически

**Примечание:** Подробнее об автоматической смене статусов см. раздел "Автоматическая смена статусов" в документации по бронированиям.

### Типы целей отзывов

- `babysitter` - отзыв о няне
- `parent` - отзыв о родителе

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

