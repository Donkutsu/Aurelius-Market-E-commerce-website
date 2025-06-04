## Installation

```bash
git clone https://github.com/your-username/aurelius-market.git
cd aurelius-market
npm install
```

### Setup DB & Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Initialize Tailwind (only if not set)

```bash
npx tailwindcss init -p
```

### Setup shadcn/ui

```bash
npx shadcn-ui@latest init
```

### Install Razorpay & Email Dependencies

```bash
npm install razorpay resend @react-email/components
```

---

## Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Use `ngrok` to expose your localhost if testing webhooks:

```bash
npx ngrok http 3000
```

---

## Testing Guide

* Use Razorpay test cards (`4111 1111 1111 1111`, any future expiry/CVV)
* Test full purchase flow + webhooks
* Optional: Add sample products using Prisma Studio

---

## Admin Dashboard

* `/admin`: Overview with metrics
* `/admin/products`: Create/edit/delete products with file/image upload
* `/admin/orders`: View & delete orders
* `/admin/users`: Manage customers
* Admin login protected with `.env` credentials

---

## Notes

* UI and structure may evolve—dependencies like shadcn/ui might update.
* Ensure `.env` secrets are correct for payments and emails to work.
* All Razorpay interactions are tested in `test` mode. Don’t forget to switch keys in production.

---

## Learn More

* [Next.js Docs](https://nextjs.org/docs)
* [Prisma ORM](https://www.prisma.io/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Razorpay Docs](https://razorpay.com/docs/)
* [Resend](https://resend.com/)

---
