import {
  RiBriefcaseLine,
  RiDashboardLine,
  RiFileTextLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react'

import type { NavigationConfig } from '@/types/navigation'

/**
 * Fonte única da navegação do app. Todas as variantes de sidebar e o
 * breadcrumb do header leem daqui. Para adicionar uma seção: crie a rota em
 * `src/app/(dashboard)/...` e adicione o item no grupo correspondente.
 * Itens sem página própria caem na página "Em construção".
 */
export const navigation: NavigationConfig = {
  app: { name: 'Acme Inc.', href: '/dashboard', icon: RiDashboardLine },
  user: {
    name: 'Usuário Exemplo',
    email: 'usuario@exemplo.com',
    avatar: '/avatars/user.jpg',
  },
  groups: [
    {
      label: 'Geral',
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
      ],
    },
    {
      label: 'Gestão',
      items: [
        { title: 'Clientes', href: '/gestao/clientes', icon: RiUserLine },
        {
          title: 'Projetos',
          href: '/gestao/projetos',
          icon: RiBriefcaseLine,
          items: [
            { title: 'Em andamento', href: '/gestao/projetos/em-andamento' },
            { title: 'Concluídos', href: '/gestao/projetos/concluidos' },
          ],
        },
        {
          title: 'Documentos',
          href: '/gestao/documentos',
          icon: RiFileTextLine,
        },
      ],
    },
    {
      label: 'Configurações',
      items: [
        { title: 'Equipe', href: '/configuracoes/equipe', icon: RiTeamLine },
      ],
    },
  ],
  secondary: [
    { title: 'Ajuda', href: '#', icon: RiQuestionLine },
    { title: 'Configurações', href: '#', icon: RiSettings3Line },
  ],
}
