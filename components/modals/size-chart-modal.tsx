import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

const SizeChartModal = () => {
  const sleevelessData = {
    itemNumber: "RB0002",
    sizes: [
      {
        size: "S",
        chest: { inch: "22.8", cm: "58" },
        length: { inch: "29.1", cm: "74" },
        shoulder: { inch: "22.8", cm: "58" },
      },
      {
        size: "M",
        chest: { inch: "23.6", cm: "60" },
        length: { inch: "29.9", cm: "76" },
        shoulder: { inch: "23.4", cm: "59.5" },
      },
      {
        size: "L",
        chest: { inch: "24.4", cm: "62" },
        length: { inch: "30.7", cm: "78" },
        shoulder: { inch: "24.0", cm: "61" },
      },
      {
        size: "XL",
        chest: { inch: "25.2", cm: "64" },
        length: { inch: "31.5", cm: "80" },
        shoulder: { inch: "24.6", cm: "62.5" },
      },
      {
        size: "2XL",
        chest: { inch: "26.0", cm: "66" },
        length: { inch: "32.3", cm: "82" },
        shoulder: { inch: "25.2", cm: "64" },
      },
    ],
  };

  const tshirtData = {
    itemNumber: "RT0022",
    sizes: [
      {
        size: "S",
        chest: { inch: "22.0", cm: "56" },
        length: { inch: "28.0", cm: "71" },
        shoulder: { inch: "19.9", cm: "50.5" },
        sleeve: { inch: "8.1", cm: "20.5" },
      },
      {
        size: "M",
        chest: { inch: "22.8", cm: "58" },
        length: { inch: "28.7", cm: "73" },
        shoulder: { inch: "20.5", cm: "52" },
        sleeve: { inch: "8.5", cm: "21.5" },
      },
      {
        size: "L",
        chest: { inch: "23.6", cm: "60" },
        length: { inch: "29.5", cm: "75" },
        shoulder: { inch: "21.1", cm: "53.5" },
        sleeve: { inch: "8.9", cm: "22.5" },
      },
      {
        size: "XL",
        chest: { inch: "24.4", cm: "62" },
        length: { inch: "30.3", cm: "77" },
        shoulder: { inch: "21.7", cm: "55" },
        sleeve: { inch: "9.3", cm: "23.5" },
      },
      {
        size: "2XL",
        chest: { inch: "25.2", cm: "64" },
        length: { inch: "31.1", cm: "79" },
        shoulder: { inch: "22.2", cm: "56.5" },
        sleeve: { inch: "9.6", cm: "24.5" },
      },
    ],
  };

  const hoodieData = {
    itemNumber: "RU0084",
    sizes: [
      {
        size: "S",
        chest: { inch: "24.4", cm: "62" },
        length: { inch: "23.2", cm: "59" },
        shoulder: { inch: "24.4", cm: "62" },
        sleeve: { inch: "23.6", cm: "60" },
      },
      {
        size: "M",
        chest: { inch: "25.2", cm: "64" },
        length: { inch: "24.0", cm: "61" },
        shoulder: { inch: "25.2", cm: "64" },
        sleeve: { inch: "24.0", cm: "61" },
      },
      {
        size: "L",
        chest: { inch: "26.0", cm: "66" },
        length: { inch: "24.8", cm: "63" },
        shoulder: { inch: "26.0", cm: "66" },
        sleeve: { inch: "24.4", cm: "62" },
      },
      {
        size: "XL",
        chest: { inch: "26.8", cm: "68" },
        length: { inch: "25.6", cm: "65" },
        shoulder: { inch: "26.8", cm: "68" },
        sleeve: { inch: "24.8", cm: "63" },
      },
      {
        size: "2XL",
        chest: { inch: "27.6", cm: "70" },
        length: { inch: "26.4", cm: "67" },
        shoulder: { inch: "27.6", cm: "70" },
        sleeve: { inch: "25.2", cm: "64" },
      },
    ],
  };

  const tabs = [
    { id: "sleeveless", label: "Tank Tops", data: sleevelessData },
    { id: "tshirt", label: "T-Shirts", data: tshirtData },
    { id: "hoodie", label: "Hoodies", data: hoodieData },
  ];

  const renderSizeTable = (data: any) => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Size</TableHead>
              <TableHead className="text-center">Chest</TableHead>
              <TableHead className="text-center">Length</TableHead>
              <TableHead className="text-center">Shoulder</TableHead>
              {data.sizes[0].sleeve && (
                <TableHead className="text-center">Sleeve</TableHead>
              )}
            </TableRow>
            <TableRow className="text-xs text-muted-foreground  ">
              <TableHead></TableHead>
              <TableHead className="text-center">inch / cm</TableHead>
              <TableHead className="text-center">inch / cm</TableHead>
              <TableHead className="text-center">inch / cm</TableHead>
              {data.sizes[0].sleeve && (
                <TableHead className="text-center">inch / cm</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sizes.map((size: any) => (
              <TableRow
                key={size.size}
                className="text-xs text-muted-foreground"
              >
                <TableCell className="font-medium">{size.size}</TableCell>
                <TableCell className="text-center">
                  {size.chest.inch} / {size.chest.cm}
                </TableCell>
                <TableCell className="text-center">
                  {size.length.inch} / {size.length.cm}
                </TableCell>
                <TableCell className="text-center">
                  {size.shoulder.inch} / {size.shoulder.cm}
                </TableCell>
                {size.sleeve && (
                  <TableCell className="text-center">
                    {size.sleeve.inch} / {size.sleeve.cm}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"link"}
            className="text-xs text-muted-foreground underline underline-offset-2 p-0"
          >
            Size Chart
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Size Chart</DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <Tabs defaultValue="sleeveless" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sleeveless">Tanks Tops</TabsTrigger>
                <TabsTrigger value="tshirt">T-Shirts</TabsTrigger>
                <TabsTrigger value="hoodie">Hoodies</TabsTrigger>
              </TabsList>

              <TabsContent value="sleeveless" className="mt-6">
                {renderSizeTable(sleevelessData)}
              </TabsContent>

              <TabsContent value="tshirt" className="mt-6">
                {renderSizeTable(tshirtData)}
              </TabsContent>

              <TabsContent value="hoodie" className="mt-6">
                {renderSizeTable(hoodieData)}
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 ">
            <p className="text-xs text-muted-foreground ">
              <span className="font-medium">Note:</span> Each piece is
              handcrafted, ensuring its uniqueness. Minor variations from
              website images and size charts are natural and highlight its
              artisanal quality.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SizeChartModal;
