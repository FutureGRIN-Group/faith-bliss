export function convertFirestoreTimestampToDate(timestamp: any): Date {
  return new Date(
    (
      timestamp as unknown as {
        _seconds: number;
        _nanoseconds: number;
      }
    )._seconds *
      1000 +
      (
        timestamp as unknown as {
          _seconds: number;
          _nanoseconds: number;
        }
      )._nanoseconds! /
        1_000_000
  );
}
