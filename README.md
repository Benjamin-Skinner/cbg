# Children's Book Generator

## Running the Project Locally

-   Create a .env file with the correct variables (see below)
-   Install all packages with `npm install`
-   Run the project with `npm run dev`

## .env variables

-   `MONGO_USERNAME`
-   `MONGO_PASSWORD`
-   `DATABASE_NAME` ("dev" in development or "main" in production)
-   `MIDJOURNEY_API_KEY` From [Imagine Pro](https://www.imaginepro.ai/signin)
-   `API_URL` (probably http://localhost:3000 or the IP of the EC2 instance)
-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`
-   `AWS_REGION`
-   `S3_BUCKET_NAME` "cbgstorage" for development or "cbgstorage-prod" for production
-   `IMAGE_DIR` Wherever you want locally downloaded images to be stored

## Account Info

-   Mongo DB: login with email
-   AWS (EC2 instance and S3 bucket for image storage)

## Project Overview

The web app allows the user to generate all of the text and image content required for a book.
Specifically:

1. Generate a title
2. Generate an outline, a list of one title for each of the 12 chapters
3. Generate an image for the hardcover front cover
4. Generate a square version of the frontcover for paperback
5. Generate a back cover image
6. Generate an image for the inside cover (below the title on the first page of the book)
7. Generate a two-sentence blurb for the back of the book.
8. Generate an image and text for each of the 12 content pages as well as the introduction and conclusion
9. Generate 5 recall (factual) questions and 5 reflect (contemplative) questions
10. Generate an accompanying image for the recall and reflect page
11. Download the following

-   A word document containing the formatted hardcover version
-   A word document containing the formatted paperback version
-   The image for the front hardcover version, the image for the front paperback version, and the image for the back.

## Notes

1. Note that the project is built to be used by one user at a time.
