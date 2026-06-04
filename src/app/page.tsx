import Button from "../components/ui/button";
import Input from "../components/ui/input";

export default function Home() {
  return (
    <>
      <h1 className="display-lg">Curated Space</h1>
      <p className="headline-lg">Institutional Trust & Precision</p>
      <p className="title-md">Task Management Redefined</p>
      <p className="body-md">
        The quick brown fox jumps over the lazy dog. A sophisticated palette
        defines hierarchy <br /> through temperature and tone rather than
        structural containment.
      </p>
      <p className="label-sm">METADATA & SYSTEM LABELS</p>
      <Button variant="primary">click me</Button>
      <Button variant="secondary">click me</Button>
      <Button variant="ghost">click me</Button>
      <Input variant="error" type="email" placeholder="type here" />
      <Input variant="primary" type="email" placeholder="type here" />
    </>
  );
}
