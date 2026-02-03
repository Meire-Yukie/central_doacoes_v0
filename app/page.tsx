"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { TabNavigation, type TabType } from "@/components/tab-navigation"
import { DoadoresTab } from "@/components/tabs/doadores-tab"
import { DoacoesTab } from "@/components/tabs/doacoes-tab"
import { CalendarioTab } from "@/components/tabs/calendario-tab"
import { AcompanhamentoTab } from "@/components/tabs/acompanhamento-tab"
import { BaixaTab } from "@/components/tabs/baixa-tab"
import { ContatosTab } from "@/components/tabs/contatos-tab"
import { LoginForm } from "@/components/login-form"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

type AuthView = "login" | "forgot-password" | "authenticated"

export default function AdminDoacoesPage() {
  const [authView, setAuthView] = useState<AuthView>("login")
  const [activeTab, setActiveTab] = useState<TabType>("doadores")
  const [searchQuery] = useState("")

  const handleLogin = () => {
    setAuthView("authenticated")
  }

  const handleLogout = () => {
    setAuthView("login")
    setActiveTab("doadores")
  }

  const handleForgotPassword = () => {
    setAuthView("forgot-password")
  }

  const handleBackToLogin = () => {
    setAuthView("login")
  }

  // Tela de login
  if (authView === "login") {
    return <LoginForm onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
  }

  // Tela de esqueci minha senha
  if (authView === "forgot-password") {
    return <ForgotPasswordForm onBack={handleBackToLogin} />
  }

  // Area autenticada
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
        {activeTab === "doadores" && <DoadoresTab searchQuery={searchQuery} />}
        {activeTab === "doacoes" && <DoacoesTab searchQuery={searchQuery} />}
        {activeTab === "calendario" && <CalendarioTab searchQuery={searchQuery} />}
        {activeTab === "acompanhamento" && <AcompanhamentoTab searchQuery={searchQuery} />}
        {activeTab === "baixa" && <BaixaTab searchQuery={searchQuery} />}
        {activeTab === "contatos" && <ContatosTab searchQuery={searchQuery} />}
      </main>
    </div>
  )
}
