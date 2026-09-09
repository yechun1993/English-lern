import { createPublicRelease } from './package-lib.mjs'

async function main() {
  try {
    const result = await createPublicRelease({ outputRoot: '发布包输出' })
    console.log('公开版发布包生成完成。')
    console.log(`文件：${result.archivePath}`)
    console.log(`SHA-256：${result.sha256}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : '公开版发布包生成失败。')
    process.exitCode = 1
  }
}

void main()
