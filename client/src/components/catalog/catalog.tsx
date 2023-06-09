import React, { useState } from "react";
import {
  Container,
  HeadText,
  HeadTextWrapper,
  SiteSection,
} from "../facade-good/facade-good";
import Carousel from "./carousel";
import { useQuery } from "@apollo/client";
import {
  GALLERY_GET_ALL,
  GalleryImages,
} from "../../gatsby-plugin-apollo/queries/gallery.query";
import { shuffle } from "../../utils/shuffle-array";
import CatalogLinks from "./catalog-links";

const Catalog = React.memo(() => {
  const { data, loading, error } =
    useQuery<GalleryImages.Root>(GALLERY_GET_ALL);

  const [items, setItems] = React.useState<GalleryImages.Item[]>([]);
  const [catigories, setCatigories] = useState<string[]>([]);

  React.useEffect(() => {
    if (!loading) {
      if (data) {
        const { findAll: arr } = data;

        const filteredArr = arr.filter((d) => d.category !== "Галерея");

        const uniqueCatigories = [
          ...new Set(filteredArr.map((item) => item.category)),
        ];

        const temp = shuffle([...filteredArr]).slice(0, 10);
        setItems(temp);
        setCatigories(uniqueCatigories);
      }
    }
  }, [loading, data]);

  return (
    <SiteSection id="catalog" css={{ paddingTop: 100 }}>
      <Container>
        <HeadTextWrapper margin="-250px">
          <HeadText>Каталог фасадов</HeadText>
        </HeadTextWrapper>
        <CatalogLinks linkNames={catigories} css={{ marginTop: 60 }} />

        <Carousel loading={loading} items={items} error={error?.message} />
      </Container>
    </SiteSection>
  );
});

export default Catalog;
