/*
  Warnings:

  - Adding new columns `consultCallLabel` and `consultCallUrl` to `HomeEnquire`.
    Existing rows will receive default values.
*/

-- AlterTable
ALTER TABLE "HomeEnquire"
ADD COLUMN     "consultCallLabel" TEXT NOT NULL DEFAULT 'Book consultant call',
ADD COLUMN     "consultCallUrl"   TEXT NOT NULL DEFAULT 'https://calendar.app.google/hdvYediQuWn4wDQH6';
