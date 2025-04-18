import type { Organization } from '@/organizations/domain/organization'
import { EmptyMessage } from '@/ui/components/empty-message/empty-message'
import { Link } from '@/ui/components/link'
import { SectionTitle } from '@/ui/components/section-title/section-title'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Urls } from '@/ui/urls/urls'
import { Heart, Users } from 'lucide-react'
import styles from './organization-tabs.module.css'

interface Props {
  userOrganizations: Organization[]
}

export const OrganizationTabs = ({ userOrganizations }: Props) => {
  return (
    <Tabs defaultValue="following">
      <header className={styles.header}>
        <SectionTitle>Mis organizaciones</SectionTitle>
        <TabsList>
          <TabsTrigger value="following">Siguiendo</TabsTrigger>
          <TabsTrigger value="my-organizations">Participando</TabsTrigger>
        </TabsList>
      </header>
      <TabsContent value="following">
        <EmptyMessage
          icon={Heart}
          title="Aún no sigues a ninguna organización"
          description="Prueba buscando una organización cerca de ti y síguela para verla por aquí."
        />
      </TabsContent>
      <TabsContent value="my-organizations">
        {userOrganizations.length === 0 && (
          <EmptyMessage
            icon={Users}
            title="Aún no participas en ninguna organización"
            description="Únete como organizador a una comunidad o crea tu propia organización para verla aquí."
          >
            <Link href={Urls.CREATE_ORGANIZATION} variant="outline" className="my-4">
              Crear organización
            </Link>
          </EmptyMessage>
        )}
      </TabsContent>
    </Tabs>
  )
}
