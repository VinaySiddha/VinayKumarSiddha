import { notFound } from 'next/navigation'
import projectsData from '../../../../data/projects.json'
import ProjectDetailPage from '@/components/ProjectDetailPage'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return projectsData.projects.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const project = projectsData.projects.find((p) => String(p.id) === id)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} | Vinay Siddha`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = projectsData.projects.find((p) => String(p.id) === id)
  if (!project) notFound()
  return <ProjectDetailPage project={project} />
}
