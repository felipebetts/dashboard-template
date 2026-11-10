'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Client = {
  name: string
  email: string
  active: boolean
  since: string
}

const clients: Client[] = [
  {
    name: 'Ana Souza',
    email: 'ana@exemplo.com',
    active: true,
    since: '03/2024',
  },
  {
    name: 'Bruno Lima',
    email: 'bruno@exemplo.com',
    active: true,
    since: '07/2024',
  },
  {
    name: 'Carla Mendes',
    email: 'carla@exemplo.com',
    active: false,
    since: '11/2023',
  },
  {
    name: 'Diego Rocha',
    email: 'diego@exemplo.com',
    active: true,
    since: '01/2025',
  },
  {
    name: 'Elisa Prado',
    email: 'elisa@exemplo.com',
    active: true,
    since: '05/2025',
  },
  {
    name: 'Felipe Costa',
    email: 'felipe@exemplo.com',
    active: false,
    since: '09/2024',
  },
  {
    name: 'Gabriela Nunes',
    email: 'gabriela@exemplo.com',
    active: true,
    since: '02/2026',
  },
  {
    name: 'Henrique Alves',
    email: 'henrique@exemplo.com',
    active: true,
    since: '06/2026',
  },
]

export function ClientsTable() {
  const [query, setQuery] = useState('')
  const filtered = clients.filter((client) =>
    client.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="Buscar cliente"
        placeholder="Buscar por nome"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-xs"
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Desde</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((client) => (
                <TableRow key={client.email}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge variant={client.active ? 'secondary' : 'outline'}>
                      {client.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.since}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
