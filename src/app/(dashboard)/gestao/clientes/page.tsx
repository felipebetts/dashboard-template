import type { Metadata } from 'next'

import { ClientsTable } from './clients-table'

// Exemplo de seção: crie a rota em `src/app/(dashboard)/...` e adicione o
// item correspondente em `src/config/navigation.ts`.
export const metadata: Metadata = { title: 'Clientes' }

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground text-sm">
          Lista de exemplo com dados fictícios.
        </p>
      </div>
      <ClientsTable />
    </div>
  )
}
