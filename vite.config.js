import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const inferredBase =
  process.env.VITE_BASE_PATH ||
  (repository
    ? repository.endsWith('.github.io')
      ? '/'
      : `/${repository}/`
    : '/')

const normalizeBase = (value) => {
  if (!value || value === '/') return '/'
  return `/${value.replace(/^\/+|\/+$/g, '')}/`
}

export default defineConfig({
  base: normalizeBase(inferredBase),
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    reporters: 'default',
  },
})
