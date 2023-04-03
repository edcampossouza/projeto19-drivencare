CREATE TABLE "patient" (
    "id" serial NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "patient_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

CREATE TABLE "workweek" (
    "id" serial NOT NULL,
    "physician_id" integer NOT NULL UNIQUE,
    "sunday" BOOLEAN NOT NULL DEFAULT 'FALSE',
    "monday" BOOLEAN NOT NULL DEFAULT 'TRUE',
    "tuesday" BOOLEAN NOT NULL DEFAULT 'TRUE',
    "wednesday" BOOLEAN NOT NULL DEFAULT 'TRUE',
    "thursday" BOOLEAN NOT NULL DEFAULT 'TRUE',
    "friday" BOOLEAN NOT NULL DEFAULT 'TRUE',
    "saturday" BOOLEAN NOT NULL DEFAULT 'FALSE',
    CONSTRAINT "workweek_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

CREATE TABLE "physician" (
    "id" serial NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "workday_begin" TIME NOT NULL DEFAULT '08:00',
    "workday_end" TIME NOT NULL DEFAULT '18:00',
    CONSTRAINT "physician_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

CREATE TABLE "appointment" (
    "id" serial NOT NULL,
    "patient_id" bigint NOT NULL,
    "physician_id" integer NOT NULL,
    "specialty_id" integer NOT NULL,
    "date" DATE NOT NULL,
    "begins_at" TIME NOT NULL,
    "ends_at" TIME NOT NULL,
    "canceled_at" TIMESTAMP DEFAULT NULL,
    "confirmed_at" TIMESTAMP DEFAULT NULL,
    CONSTRAINT "appointment_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

CREATE TABLE "physician_specialty" (
    "id" serial NOT NULL,
    "physician_id" integer NOT NULL,
    "specialty_id" integer NOT NULL,
    CONSTRAINT "physician_specialty_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

CREATE TABLE "specialty" (
    "id" serial NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "specialty_pk" PRIMARY KEY ("id")
) WITH (OIDS = FALSE);

ALTER TABLE
    "workweek"
ADD
    CONSTRAINT "workweek_fk0" FOREIGN KEY ("physician_id") REFERENCES "physician"("id");

ALTER TABLE
    "appointment"
ADD
    CONSTRAINT "appointment_fk0" FOREIGN KEY ("patient_id") REFERENCES "patient"("id");

ALTER TABLE
    "appointment"
ADD
    CONSTRAINT "appointment_fk1" FOREIGN KEY ("physician_id") REFERENCES "physician"("id");

ALTER TABLE
    "appointment"
ADD
    CONSTRAINT "appointment_fk2" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id");

ALTER TABLE
    "physician_specialty"
ADD
    CONSTRAINT "physician_specialty_fk0" FOREIGN KEY ("physician_id") REFERENCES "physician"("id");

ALTER TABLE
    "physician_specialty"
ADD
    CONSTRAINT "physician_specialty_fk1" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id");