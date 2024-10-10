import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Divider } from "@nextui-org/divider";

export default function Home() {
  return (
    <>
      <Card className="grid grid-cols-2 h-60">
        <Image
          className=" items-center align-middle border size-60"
          src="https://picsum.photos/200/300"
        />
        <div className="flex-row items-center text-center border h-60">
          <CardHeader>
            <h1 className="text-5xl">Video Title</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Scheduled For:</p>
            <p>Video Description:</p>
            <p>Description:</p>
          </CardBody>
        </div>
      </Card>
    </>
  );
}
