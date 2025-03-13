export default function VotingResults({ percentFor }: { percentFor: number }) {
  const roundedPercentFor = Math.round(percentFor * 10) / 10; // Arrondi au dixième
  const roundedPercentAgainst = Math.round((100 - percentFor) * 10) / 10;

  return (
    <main>
      <h1 className="font-semibold text-lg">Results</h1>
      <section
        className="
        h-4
        w-full
        bg-danger-500
        rounded-full
        text-white
        font-bold
        text-xs
        flex
        flex-row
        justify-between
        place-items-center
      "
      >
        <div
          className="h-full bg-success-500 rounded-full pl-1 flex place-items-center"
          style={{ width: `${roundedPercentFor}%` }}
        >
          {roundedPercentFor}%
        </div>
        <p className="pr-1">{roundedPercentAgainst}%</p>
      </section>
    </main>
  );
}
