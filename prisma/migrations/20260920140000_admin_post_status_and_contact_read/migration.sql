-- Phase 11 (Admin CMS): a draft/published flag for posts and a read flag for contact submissions.
-- Both are additive with defaults, so existing rows keep working: every existing post stays
-- published (public) and every existing submission starts unread.
-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;
