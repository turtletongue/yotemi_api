SELECT
  base.id,
  base.username,
  base."accountAddress",
  base."authId",
  base."firstName",
  base."lastName",
  base.biography,
  base."avatarPath",
  base."coverPath",
  base."isVerified",
  base."isBlocked",
  base."createdAt",
  base."updatedAt",
  base."reviewsCount",
  base."averagePoints",
  base."interviewsCount",
  base."topicsIds",
  base."confidenceNumber",
  (
    (
      ((base."averagePoints" * (base."reviewsCount") :: numeric)) :: double precision + (
        GREATEST(base."confidenceNumber", (1) :: double precision) * (
          COALESCE(
            (
              SELECT
                avg(reviews.points) AS avg
              FROM
                reviews
              WHERE
                (reviews."isModerated" = TRUE)
            ),
            (0) :: numeric
          )
        ) :: double precision
      )
    ) / (
      (base."reviewsCount") :: double precision + GREATEST(base."confidenceNumber", (1) :: double precision)
    )
  ) AS "contentWeight"
FROM
  (
    SELECT
      "grandBase".id,
      "grandBase".username,
      "grandBase"."accountAddress",
      "grandBase"."authId",
      "grandBase"."firstName",
      "grandBase"."lastName",
      "grandBase".biography,
      "grandBase"."avatarPath",
      "grandBase"."coverPath",
      "grandBase"."isVerified",
      "grandBase"."isBlocked",
      "grandBase"."createdAt",
      "grandBase"."updatedAt",
      "grandBase"."reviewsCount",
      "grandBase"."averagePoints",
      "grandBase"."interviewsCount",
      "grandBase"."topicsIds",
      (
        SELECT
          percentile_cont((0.25) :: double precision) WITHIN GROUP (
            ORDER BY
              ((temp."reviewsCount") :: double precision)
          ) AS percentile_cont
        FROM
          (
            SELECT
              users.id,
              users.username,
              users."accountAddress",
              users."authId",
              users."firstName",
              users."lastName",
              users.biography,
              users."avatarPath",
              users."coverPath",
              users."isVerified",
              users."isBlocked",
              users."createdAt",
              users."updatedAt",
              COALESCE(
                (
                  SELECT
                    count(*) AS count
                  FROM
                    reviews
                  WHERE
                    (
                      (reviews."isModerated" = TRUE)
                      AND (reviews."userId" = users.id)
                    )
                ),
                (0) :: bigint
              ) AS "reviewsCount"
            FROM
              users
          ) temp
      ) AS "confidenceNumber"
    FROM
      (
        SELECT
          users.id,
          users.username,
          users."accountAddress",
          users."authId",
          users."firstName",
          users."lastName",
          users.biography,
          users."avatarPath",
          users."coverPath",
          users."isVerified",
          users."isBlocked",
          users."createdAt",
          users."updatedAt",
          COALESCE(
            (
              SELECT
                count(*) AS count
              FROM
                reviews
              WHERE
                (
                  (reviews."isModerated" = TRUE)
                  AND (reviews."userId" = users.id)
                )
            ),
            (0) :: bigint
          ) AS "reviewsCount",
          COALESCE(
            (
              SELECT
                avg(reviews.points) AS avg
              FROM
                reviews
              WHERE
                (
                  (reviews."isModerated" = TRUE)
                  AND (reviews."userId" = users.id)
                )
            ),
            (0) :: numeric
          ) AS "averagePoints",
          COALESCE(
            (
              SELECT
                count(*) AS count
              FROM
                interviews
              WHERE
                (interviews."creatorId" = users.id)
            ),
            (0) :: bigint
          ) AS "interviewsCount",
          ARRAY(
            SELECT
              "_TopicToUser"."A"
            FROM
              "_TopicToUser"
            WHERE
              ("_TopicToUser"."B" = users.id)
          ) AS "topicsIds"
        FROM
          users
      ) "grandBase"
  ) base;