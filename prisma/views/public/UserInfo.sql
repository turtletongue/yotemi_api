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
  base.rating,
  base."interviewsCount",
  base."topicsIds",
  base."confidenceNumber",
  (
    (
      ((base.rating * (base."reviewsCount") :: numeric)) :: double precision + (
        base."confidenceNumber" * (
          (
            SELECT
              avg(reviews.points) AS avg
            FROM
              reviews
            WHERE
              (reviews."isModerated" = TRUE)
          )
        ) :: double precision
      )
    ) / (
      (base."reviewsCount") :: double precision + base."confidenceNumber"
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
      "grandBase".rating,
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
          ) AS "reviewsCount",
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
          ) AS rating,
          (
            SELECT
              count(*) AS count
            FROM
              interviews
            WHERE
              (interviews."creatorId" = users.id)
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