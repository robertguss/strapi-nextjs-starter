import clsx from 'clsx'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MDXComponents } from '@/components/MDXComponents'
import { PageLinks } from '@/components/PageLinks'
import { formatDate } from '@/lib/formatDate'
import { type Article, type MDXEntry, loadArticles } from '@/lib/mdx'
import dayjs from 'dayjs'
import { getStrapiURL } from '../../utils/api-helpers'

export async function generateStaticParams() {
  const articles = await fetch(
    getStrapiURL() + '/api/articles?populate=*',
  ).then((res) => res.json())

  return articles.data.map((article: any) => ({
    id: article.id,
    slug: article.attributes.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const article = await fetch(
    getStrapiURL() +
      `/api/articles?filters[slug][$eq]=${params.slug}&populate=*`,
  ).then((res) => res.json())

  return (
    <>
      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <header className="mx-auto flex max-w-5xl flex-col text-center">
            <h1 className="mt-6 font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-6xl">
              {article.data[0].attributes.title}
            </h1>
            <time
              dateTime={article.date}
              className="order-first text-sm text-neutral-950"
            >
              {dayjs(article.data[0].attributes.createdAt).format('MM/DD/YYYY')}
            </time>
            <p className="mt-6 text-sm font-semibold text-neutral-950">
              by Chelsea Hagon, Senior Developer
            </p>
          </header>
        </FadeIn>

        <FadeIn>
          <div className="mt-24 sm:mt-32 lg:mt-40 [&>*]:mx-auto [&>*]:max-w-3xl [&>:first-child]:!mt-0 [&>:last-child]:!mb-0">
            <img
              src={`${getStrapiURL()}${article.data[0].attributes.cover.data.attributes.formats.large.url}`}
            />
            <div className="typography">
              {article.data[0].attributes.blocks[0].body}
            </div>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
