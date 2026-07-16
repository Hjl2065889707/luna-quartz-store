import { execFileSync } from 'node:child_process'
import { mkdirSync, appendFileSync } from 'node:fs'
import path from 'node:path'

type PageTarget = {
  label: string
  url: string
}

type CurlMetrics = {
  status: number
  dns: number
  connect: number
  tls: number
  ttfb: number
  total: number
  size: number
  speed: number
}

const siteUrl = process.env.MEASURE_SITE_URL ?? 'https://shop.huangjunlong.cloud'
const repeat = Number.parseInt(process.env.MEASURE_REPEAT ?? '3', 10)
const note = process.env.MEASURE_NOTE ?? 'manual'
const logPath = path.join(process.cwd(), 'docs', 'loading-log.md')

const pages: PageTarget[] = [
  { label: 'home', url: `${siteUrl}/` },
  { label: 'shop', url: `${siteUrl}/shop` },
  { label: 'bracelets', url: `${siteUrl}/collections/bracelets` },
  { label: 'tumbled-stones', url: `${siteUrl}/collections/tumbled-stones` },
  { label: 'crystal-points', url: `${siteUrl}/collections/crystal-points` },
  { label: 'suncatchers', url: `${siteUrl}/collections/suncatchers` },
  { label: 'about', url: `${siteUrl}/about` },
  { label: 'faq', url: `${siteUrl}/faq` },
]

const formatSeconds = (value: number) => `${value.toFixed(3)}s`
const formatSpeed = (bytesPerSecond: number) =>
  `${(bytesPerSecond / 1024).toFixed(1)} KB/s`

const measure = (target: PageTarget): CurlMetrics => {
  const output = execFileSync(
    'curl',
    [
      '-L',
      '--max-time',
      '90',
      '-o',
      '/dev/null',
      '-s',
      '-w',
      [
        '{"status":%{http_code}',
        ',"dns":%{time_namelookup}',
        ',"connect":%{time_connect}',
        ',"tls":%{time_appconnect}',
        ',"ttfb":%{time_starttransfer}',
        ',"total":%{time_total}',
        ',"size":%{size_download}',
        ',"speed":%{speed_download}}',
      ].join(''),
      target.url,
    ],
    { encoding: 'utf8' },
  )

  return JSON.parse(output) as CurlMetrics
}

const runStartedAt = new Date()
const rows: string[] = []

for (const page of pages) {
  for (let attempt = 1; attempt <= repeat; attempt += 1) {
    try {
      const metrics = measure(page)
      rows.push(
        [
          runStartedAt.toISOString(),
          note,
          page.label,
          attempt.toString(),
          metrics.status.toString(),
          formatSeconds(metrics.dns),
          formatSeconds(metrics.connect),
          formatSeconds(metrics.tls),
          formatSeconds(metrics.ttfb),
          formatSeconds(metrics.total),
          metrics.size.toString(),
          formatSpeed(metrics.speed),
        ].join(' | '),
      )
      console.log(
        `${page.label} #${attempt}: status=${metrics.status} ttfb=${formatSeconds(metrics.ttfb)} total=${formatSeconds(metrics.total)}`,
      )
    } catch (error) {
      rows.push(
        [
          runStartedAt.toISOString(),
          note,
          page.label,
          attempt.toString(),
          'ERROR',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          error instanceof Error ? error.message.replaceAll('\n', ' ') : 'unknown',
        ].join(' | '),
      )
      console.error(`${page.label} #${attempt}: failed`)
    }
  }
}

mkdirSync(path.dirname(logPath), { recursive: true })

appendFileSync(
  logPath,
  [
    '',
    `## Automated run - ${runStartedAt.toISOString()}`,
    '',
    `Site: ${siteUrl}`,
    `Note: ${note}`,
    `Repeat: ${repeat}`,
    '',
    '| Time | Note | Page | Attempt | Status | DNS | Connect | TLS | TTFB | Total | Bytes | Speed |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row} |`),
    '',
  ].join('\n'),
)

console.log(`Saved results to ${logPath}`)
