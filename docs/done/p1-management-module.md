# Current Plan

## Goal

สร้าง Management Module สำหรับ admin และ manager จัดการ master data ของระบบ ได้แก่ Department, Position และ Prefix
โดย manager ไม่ต้องเข้า /admin และ 3 entities นี้มีโครงสร้างเหมือนกัน (id, name, createdAt)

---

## Plan

### Step 1 — tRPC Router

สร้าง `trpc/server/routers/management.ts`

- procedure `department.list` — ดึง department ทั้งหมด
- procedure `department.create` — สร้าง department ใหม่ (manager, admin เท่านั้น)
- procedure `department.update` — แก้ชื่อ department (manager, admin เท่านั้น)
- procedure `department.delete` — ลบ department ถ้าไม่มี user ผูกอยู่ (manager, admin เท่านั้น)
- ทำแบบเดียวกันสำหรับ `position.*` และ `prefix.*`

Register ใน `trpc/server/routers/_app.ts`

### Step 2 — Page และ Component

```
app/management/
├── page.tsx                        ← Server Component, prefetch ข้อมูลทั้ง 3 tables, guard permission
└── _components/
    ├── management-tabs.tsx         ← Client Component, Tabs wrapper
    ├── master-data-table.tsx       ← Reusable table + inline add/edit/delete (ใช้กับทั้ง 3 entities)
    └── master-data-form.tsx        ← Form สำหรับ create/edit (ใช้กับทั้ง 3 entities)
```

**เหตุผลที่ใช้ Tabs แทน sub-routes:**
ทั้ง 3 entities มี structure เหมือนกันทุกอย่าง (name เดียว) การแยก route เพิ่ม complexity โดยไม่จำเป็น

### Step 3 — Permission Guard

ใน `app/management/page.tsx`:

- ตรวจ session ด้วย `authIsRequired()`
- ตรวจ permission `management: ['read']` (หรือ check role เป็น admin/manager)
- ถ้าไม่มีสิทธิ์ redirect ไป /dashboard

### Step 4 — Sidebar Navigation

เพิ่ม Management link ใน `components/app-sidebar.tsx`

- แสดงเฉพาะ user ที่มี role manager หรือ admin

---

## Constraints

- ใช้ tRPC procedure ทุก mutation ห้าม call DB โดยตรงจาก component
- `master-data-table.tsx` และ `master-data-form.tsx` ต้อง reusable กับทั้ง 3 entities ผ่าน props
- ห้ามลบ department/position/prefix ถ้ายังมี userProfile ผูกอยู่ — ให้ tRPC throw `TRPCError` code `CONFLICT` พร้อม message บอกจำนวน user ที่ผูกอยู่
- Sidebar ซ่อน Management link สำหรับ role ต่ำกว่า manager (user ทั่วไปไม่เห็น link เลย)
- Permission check ต้องทำที่ Server Component (page.tsx) ไม่ใช่ Client Component

---

---

## Task Log

- 2026-06-10: Implemented the Management module with a guarded `/management` page, a new `management` tRPC router for department/position/prefix CRUD, reusable master data table/form components, and a role-based Management link in the sidebar.

## Open Questions

_ปิดแล้วทุกข้อ_

| คำถาม                         | คำตอบ                                                                 |
| ----------------------------- | --------------------------------------------------------------------- |
| Soft delete หรือ Hard delete? | **Hard delete** — block ถ้ายังมี userProfile ผูกอยู่ ให้ return error |
| Sidebar Management link       | **ซ่อน** สำหรับ role ต่ำกว่า manager — แสดงเฉพาะ manager และ admin    |
