export const recipes = [
  {
    titleKey: "labeling.recipes.bbox.title",
    type: "community",
    group: "Computer Vision",
    image: "bbox.png",
    detailsKey: "labeling.recipes.bbox.details",
    config: `<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>
</View>`,
  },
  {
    titleKey: "labeling.recipes.polygon.title",
    type: "community",
    group: "Computer Vision",
    image: "polygon.png",
    detailsKey: "labeling.recipes.polygon.details",
    config: `<View>
  <Header value="Select label and click on image to start"/>
  <Image name="image" value="$image"/>
  <PolygonLabels name="label" toName="image"
                 strokeWidth="3" pointSize="small"
                 opacity="0.9">
    <Label value="Airplane" background="red"/>
    <Label value="Car" background="blue"/>
  </PolygonLabels>
</View>
`,
  },
  {
    titleKey: "labeling.recipes.ner.title",
    type: "community",
    group: "NLP",
    image: "text.png",
    detailsKey: "labeling.recipes.ner.details",
    config: `<View>
  <Labels name="label" toName="text">
    <Label value="Person" background="red"/>
    <Label value="Organization" background="darkorange"/>
    <Label value="Fact" background="orange"/>
    <Label value="Money" background="green"/>
    <Label value="Date" background="darkblue"/>
    <Label value="Time" background="blue"/>
    <Label value="Ordinal" background="purple"/>
    <Label value="Percent" background="#842"/>
    <Label value="Product" background="#428"/>
    <Label value="Language" background="#482"/>
    <Label value="Location" background="rgba(0,0,0,0.8)"/>
  </Labels>

  <Text name="text" value="$text"/>
</View>`,
  },
];
