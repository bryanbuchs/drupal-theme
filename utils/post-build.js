// post-build.js

import fs from 'fs'
import path from 'path'

function isOnlyComments (content) {
  const noInlineComments = content.replace(/\/\/.*/g, '').trim()
  const noBlockComments = noInlineComments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
  return noBlockComments.length === 0
}

/**
 * Recursively removes JavaScript files from a directory if they contain only comments.
 *
 * @param {string} directory - The path to the directory to process.
 *
 * This function traverses the specified directory and its subdirectories,
 * checking each `.js` file to determine if it contains only comments. If a file
 * is found to contain only comments, it is deleted. Subdirectories are processed
 * recursively.
 *
 * Note: The function assumes the existence of an `isOnlyComments` utility function
 * that determines whether a file's content consists solely of comments.
 */
function removeCommentOnlyFiles (directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      removeCommentOnlyFiles(fullPath)
    } else if (fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      if (isOnlyComments(content)) {
        fs.unlinkSync(fullPath)
        // console.log(`Removed empty ${fullPath}`)
        // if (fs.existsSync(mapPath)) {
        //   fs.unlinkSync(mapPath)
        // }
      }
    }
  }
}

removeCommentOnlyFiles('./dist')
