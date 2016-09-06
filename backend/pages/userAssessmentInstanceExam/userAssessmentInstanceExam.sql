-- BLOCK get_questions
SELECT
    iq.*,
    ((lag(z.id) OVER w) IS DISTINCT FROM z.id) AS start_new_zone,
    z.id AS zone_id,
    z.title AS zone_title,
    q.title AS question_title,
    aq.max_points,
    qo.row_order,
    qo.question_number
FROM
    instance_questions AS iq
    JOIN assessment_questions AS aq ON (aq.id = iq.assessment_question_id)
    JOIN zones AS z ON (z.id = aq.zone_id)
    JOIN questions AS q ON (q.id = aq.question_id)
    JOIN question_order($assessment_instance_id) AS qo ON (iq.id = qo.instance_question_id)
WHERE
    iq.assessment_instance_id = $assessment_instance_id
WINDOW
    w AS (ORDER BY qo.row_order)
ORDER BY qo.row_order;
