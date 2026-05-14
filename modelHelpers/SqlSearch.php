<?php
    declare(strict_types=1);

    final class SqlSearch
    {
        /**
         * Escapes backslash, percent, and underscore for safe SQL LIKE fragments.
         *
         * @param string $value
         * @return string
         */
        public static function escapeLike(string $value): string
        {
            return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
        }

        /**
         * Splits input into non-whitespace tokens (Unicode-aware).
         *
         * @param string $search
         * @return list<string>
         */
        public static function splitSearchTerms(string $search): array
        {
            if ($search === '') {
                return [];
            }

            if (!preg_match_all('/\S+/u', $search, $m)) {
                return [];
            }

            /** @var list<string> $out */
            $out = [];
            foreach ($m[0] as $word) {
                $out[] = (string) $word;
            }

            return $out;
        }

        /**
         * Builds SQL LIKE patterns with escaped wildcards for each token.
         *
         * @param list<string> $tokens
         * @return list<string>
         */
        public static function likePatternsFromTokens(array $tokens): array
        {
            $patterns = [];
            foreach ($tokens as $t) {
                $patterns[] = '%' . self::escapeLike($t) . '%';
            }

            return $patterns;
        }

        /**
         * Haystack expression for subject rows joined to teachers (table aliases s, t).
         *
         * @return string
         */
        public static function subjectJoinHaystackSql(): string
        {
            return 'CONCAT_WS(\' \', s.subject_name, COALESCE(t.name, \'\'), CAST(s.schedule_time AS CHAR))';
        }

        /**
         * Binds a variable-length parameter list to a mysqli prepared statement.
         *
         * @param \mysqli_stmt $stmt
         * @param string $types mysqli bind_param type string
         * @param list<mixed> $values
         * @return bool
         */
        public static function bindPreparedParams(\mysqli_stmt $stmt, string $types, array $values): bool
        {
            $refs = [];
            $refs[] = &$types;
            foreach ($values as $k => $_v) {
                $refs[] = &$values[$k];
            }

            return call_user_func_array([$stmt, 'bind_param'], $refs);
        }
    }
?>
