import { ArrowLeftIcon, HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PublicNotFoundRoutePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.14),_transparent_32%),linear-gradient(180deg,_var(--background),_oklch(0.99_0.02_140))]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 lg:px-10">
        <Card className="w-full border-border/70 bg-card/95 shadow-sm">
          <CardHeader className="space-y-3">
            <Badge className="w-fit" variant="secondary">
              Error 404
            </Badge>
            <CardTitle className="text-3xl tracking-tight">Halaman tidak ditemukan</CardTitle>
            <CardDescription>
              URL yang kamu buka tidak tersedia atau sudah dipindahkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button render={<Link to="/blog" />} variant="default">
              <HomeIcon className="size-4" />
              Ke blog
            </Button>
            <Button
              onClick={() => {
                window.history.back()
              }}
              variant="outline"
            >
              <ArrowLeftIcon className="size-4" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
