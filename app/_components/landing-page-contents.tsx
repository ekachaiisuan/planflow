'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  FolderGit2, 
  FileText, 
  Bell, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ListTodo, 
  Download, 
  Users, 
  Activity,
  ChevronRight
} from 'lucide-react';

const LandingPageContent = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/20">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
              Planflow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">ฟีเจอร์หลัก</a>
            <a href="#overview" className="hover:text-foreground transition-colors">ภาพรวมโครงการ</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">ขั้นตอนการทำงาน</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-lg transition-all">
              เข้าสู่ระบบ
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/5 text-xs font-semibold text-indigo-500 mb-8 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            ระบบติดตามโครงการและการจัดทำแผนปฏิบัติการโฉมใหม่
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none mb-6">
            ขับเคลื่อนโครงการในองค์กร <br className="hidden md:block"/>
            <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
              ติดตามความก้าวหน้าและออกรายงาน PDF
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Planflow ช่วยให้คุณบริหารจัดการ Workspace ของแต่ละโครงการร่วมกับทีมงาน ออกการ์ดกิจกรรม
            คำนวณเปอร์เซ็นต์ความก้าวหน้าผ่าน Sub-task และแปลงผลการดำเนินงานเป็นรายงาน PDF 
            ตามรูปแบบฟอร์มทางการได้ง่ายๆ ในไม่กี่คลิก
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all text-base"
            >
              เริ่มต้นใช้งานฟรี
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-muted/60 hover:bg-muted text-foreground font-semibold px-8 py-4 rounded-xl transition-all text-base border border-border"
            >
              สำรวจฟีเจอร์หลัก
            </a>
          </div>

          {/* Dashboard Preview Graphic (CSS mockup) */}
          <div className="relative rounded-2xl border border-border/60 bg-muted/40 p-2 shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent pointer-events-none z-10" />
            <div className="bg-background rounded-xl border border-border overflow-hidden shadow-inner flex flex-col md:flex-row aspect-video w-full">
              
              {/* Mock Sidebar */}
              <div className="w-full md:w-56 border-r border-border bg-muted/20 p-4 text-left hidden md:flex flex-col justify-between">
                <div>
                  {/* Sidebar Brand */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Planflow Workspace</span>
                  </div>

                  {/* Sidebar Items */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 text-xs font-medium">
                      <Activity className="w-3.5 h-3.5" />
                      ภาพรวมระบบ
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted text-xs font-medium">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      โครงการทั้งหมด
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted text-xs font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      ออกรายงาน PDF
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-700">
                    PF
                  </div>
                  <div>
                    <div className="text-xs font-semibold">ทีมพัฒนาระบบ</div>
                    <div className="text-[10px] text-muted-foreground">Admin</div>
                  </div>
                </div>
              </div>

              {/* Mock Content Dashboard */}
              <div className="flex-1 p-6 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">แดชบอร์ดโครงการปีงบประมาณ 2569</h3>
                    <div className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                      กำลังดำเนินการ 12 โครงการ
                    </div>
                  </div>

                  {/* Mock Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Card 1 */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 px-2 py-0.5 rounded-sm">
                          สายงานเทคโนโลยี
                        </span>
                        <span className="text-xs text-muted-foreground">เหลืออีก 12 วัน</span>
                      </div>
                      <h4 className="font-bold text-sm mb-3">โครงการจัดตั้งระบบความมั่นคงปลอดภัยไซเบอร์</h4>
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>ความก้าวหน้าโครงการ</span>
                          <span className="font-semibold text-foreground">75%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>

                      {/* Sub-tasks */}
                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          เสร็จแล้ว 3/4 งานย่อย
                        </span>
                      </div>
                    </div>

                    {/* Project Card 2 */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400 px-2 py-0.5 rounded-sm">
                          สายงานบริหารจัดการ
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold text-amber-500">เร่งด่วน</span>
                      </div>
                      <h4 className="font-bold text-sm mb-3">โครงการฝึกอบรมทักษะเทคโนโลยีและ AI ประจำปี</h4>
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>ความก้าวหน้าโครงการ</span>
                          <span className="font-semibold text-foreground">40%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-violet-600 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>

                      {/* Sub-tasks */}
                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          เสร็จแล้ว 2/5 งานย่อย
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats row */}
                <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    แผนปฏิบัติการประจำปีงบประมาณ.pdf
                  </span>
                  <button className="flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 px-3 py-1.5 rounded-md font-semibold hover:bg-indigo-100 transition-colors">
                    <Download className="w-3 h-3" />
                    ออกรายงาน PDF
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">ฟีเจอร์เด่นเพื่อการจัดการโครงการอย่างมืออาชีพ</h2>
            <p className="text-muted-foreground">
              ฟังก์ชันการทำงานที่ถูกออกแบบมาเพื่อความคล่องตัวและลดความซับซ้อนในการทำงานร่วมกันภายในองค์กร
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-indigo-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Workspace ทำงานร่วมกัน</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                สร้างพื้นที่ทำงานเฉพาะสำหรับแต่ละโครงการหรือแต่ละทีม แบ่งปันข้อมูลโครงการ การ์ดกิจกรรม และไฟล์แนบร่วมกันได้อย่างมีประสิทธิภาพ
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-violet-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ListTodo className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sub-tasks ติดตามงานย่อย</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                จัดการกิจกรรมภายใต้โครงการอย่างละเอียดด้วยการสร้างงานย่อย (Sub-tasks) พร้อมระบบคำนวณและแสดงเปอร์เซ็นต์ความก้าวหน้าโครงการแบบอัตโนมัติ
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-fuchsia-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">PDF Report ฟอร์มราชการ</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                สร้างและพิมพ์รายงานสรุปผล หรือรวบรวมแผนปฏิบัติการประจำปีงบประมาณออกมาเป็นรูปแบบไฟล์ PDF ที่จัดรูปแบบตรงตามฟอร์มที่สำนักงานกำหนด
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">อัปโหลดและแชร์ไฟล์แนบ</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ระบบจัดเก็บไฟล์แนบโครงการและเอกสารอ้างอิงผ่านบริการ S3 (AWS S3 หรือ MinIO ในโปรดักชัน) ด้วยระบบความปลอดภัยแบบ Presigned URLs
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-amber-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">ระบบแจ้งเตือนใกล้ครบกำหนด</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ไม่พลาดทุกวันครบกำหนดของโครงการด้วยการแจ้งเตือนอัจฉริยะ ทั้งบนหน้าเว็บแอปพลิเคชันและแจ้งเตือนผ่านอีเมล (Email Notifications)
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-cyan-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">แดชบอร์ดสรุปความก้าวหน้า</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ติดตามประสิทธิภาพขององค์กรและโครงการทั้งหมดได้อย่างง่ายดายด้วยสถิติ กราฟสรุปผล และตัวกรองสถานะที่ทำงานได้อย่างรวดเร็ว
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Project Overview / Tech Stack Section */}
      <section id="overview" className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Tech Stack Details */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">สถาปัตยกรรมระบบและเทคโนโลยี</h2>
              <p className="text-muted-foreground leading-relaxed">
                Planflow พัฒนาขึ้นด้วยเทคโนโลยีที่ทันสมัยและได้มาตรฐานระดับสากล เพื่อรองรับการทำงานที่รวดเร็ว มั่นคงปลอดภัย และยืดหยุ่นต่อการสเกล
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Next.js 16 (App Router) & React 19</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">ทำงานแบบ Server-first รวดเร็วและเป็นมิตรกับผู้ใช้งาน</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">tRPC v11 & Drizzle ORM</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">การเชื่อมต่อ API แบบ Type-safe พร้อมฐานข้อมูล PostgreSQL (NeonDB)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Better Auth (RBAC)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">ระบบความปลอดภัยที่แข็งแกร่งด้วยการกำหนดสิทธิ์การเข้าถึงข้อมูลตามบทบาทของทีม</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">S3 Storage Abstraction</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">เชื่อมต่อจัดเก็บไฟล์ระหว่าง AWS S3 (Development) และ MinIO (Production) ได้อย่างยืดหยุ่น</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Card illustration */}
            <div className="p-8 rounded-2xl border border-border bg-muted/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-indigo-500/10 to-transparent blur-xl" />
              <h3 className="font-bold text-lg mb-6">แผนผังระบบการทำงาน</h3>
              
              <div className="space-y-4 relative z-10 text-xs">
                {/* VM App Server box */}
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">VM / Application Server</span>
                  <div className="flex gap-2 text-[10px] text-muted-foreground mt-2">
                    <span className="px-2 py-1 bg-background border border-border rounded-md">Next.js 16</span>
                    <span className="px-2 py-1 bg-background border border-border rounded-md">Docker</span>
                    <span className="px-2 py-1 bg-background border border-border rounded-md">Nginx</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-muted-foreground my-1">
                  <ChevronRight className="rotate-90 w-4 h-4" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Database box */}
                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <span className="font-bold block mb-1">Database Cloud</span>
                    <span className="text-[10px] text-muted-foreground">PostgreSQL (NeonDB)</span>
                  </div>

                  {/* Storage box */}
                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <span className="font-bold block mb-1">Storage Server</span>
                    <span className="text-[10px] text-muted-foreground">MinIO / AWS S3 (S3 API)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">เริ่มต้นทำงานได้ง่ายใน 3 ขั้นตอน</h2>
            <p className="text-muted-foreground">กระบวนการจัดเก็บโครงการและประเมินผลการทำงานที่ง่ายดาย</p>
          </div>

          <div className="relative border-l border-indigo-200 dark:border-indigo-900/60 ml-4 md:ml-32 space-y-12">
            
            {/* Step 1 */}
            <div className="relative pl-8 md:pl-12">
              {/* Dot */}
              <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-600">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">สร้าง Workspace และการ์ดโครงการ</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                เข้าสู่ระบบ สร้างพื้นที่ทำงานร่วมกับทีมของคุณ แล้วเพิ่มการ์ดโครงการแต่ละโครงการ 
                พร้อมกำหนดสิทธิ์เข้าใช้งาน รายละเอียด ระยะเวลาดำเนินงาน และผู้รับผิดชอบหลัก
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 md:pl-12">
              {/* Dot */}
              <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-600">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">อัปเดตความก้าวหน้าด้วย Sub-tasks</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                แจกแจงงานย่อยภายใต้การ์ดกิจกรรมโครงการ สมาชิกในทีมทำการอัปเดตความสำเร็จของแต่ละงานย่อย 
                ระบบจะนำมาคำนวณและประมวลผลเป็นร้อยละความก้าวหน้าโครงการโดยอัตโนมัติ
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 md:pl-12">
              {/* Dot */}
              <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-600">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">ส่งออกรายงาน PDF ตามมาตรฐานองค์กร</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                เมื่อสิ้นสุดระยะเวลาหรือจบปีงบประมาณ รวบรวมข้อมูลโครงการทั้งหมดและออกรายงานสรุปผลการดำเนินงาน 
                หรือแผนปฏิบัติการประจำปีเป็นไฟล์ PDF ตามมาตรฐานที่สำนักงานกำหนด พร้อมจัดส่งหรือพิมพ์ใช้งานได้ทันที
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 relative overflow-hidden bg-linear-to-tr from-indigo-950 via-purple-950 to-violet-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-80" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            พร้อมจัดการโครงการของคุณในระดับถัดไปแล้วหรือยัง?
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            เริ่มต้นใช้งานระบบ Planflow วันนี้ เพื่อการวางแผนโครงการที่มีประสิทธิภาพ 
            และช่วยให้ทุกการสรุปผลการดำเนินงานภายในองค์กรเป็นเรื่องง่ายและรวดเร็ว
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-white text-indigo-950 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              สมัครสมาชิกเลยตอนนี้
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-indigo-600/30 text-white hover:bg-indigo-600/50 font-bold px-8 py-4 rounded-xl border border-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              เข้าสู่ระบบสมาชิก
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-md tracking-tight">Planflow</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Planflow. ระบบติดตามโครงการและแผนปฏิบัติการภายในองค์กร.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPageContent;
