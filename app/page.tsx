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

export default function AdminDoacoesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("doadores")
  const [searchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
