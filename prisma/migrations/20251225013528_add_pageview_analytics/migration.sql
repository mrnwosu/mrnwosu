-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "country" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_pathname_idx" ON "PageView"("pathname");

-- CreateIndex
CREATE INDEX "PageView_countryCode_idx" ON "PageView"("countryCode");

-- CreateIndex
CREATE INDEX "PageView_ipHash_idx" ON "PageView"("ipHash");
