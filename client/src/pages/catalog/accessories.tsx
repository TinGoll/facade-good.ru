import { HeadFC, PageProps } from "gatsby";
import React from "react";
import SiteHeadder from "../../components/header/site-header";
import { SEO } from "../../components/seo";
import AppLayout from "../../layout/app-layout";
import SiteFooter from "../../components/footer/site-footer";
import {
  Box,
  CardButton,
  Container,
  HeadText,
  HeadTextWrapper,
  Main,
} from "../../components/facade-good/facade-good";
import { FacadeGood } from "../../app-types";
import CatalogImages from "../../components/catalog/catalog-images";
import { navigate } from "gatsby";
import { GalleryImages } from "../../gatsby-plugin-apollo/queries/gallery.query";
import GalleryModalWrapper from "../../components/image-grid/gallery-modal-wrapper";
import ScrollToTop from "../../components/scroll/scroll-to-top";

const AccessoriesPage: React.FC<PageProps> = ({ location, params }) => {
  const params1 = new URLSearchParams(location.search);
  const parameter1 = params1.get("test");

  /******************************************** */
  // Для открытия фото в модальном окне
  const [galleryItem, setGalleryItem] =
    React.useState<GalleryImages.Item | null>(null);
  const onCloseModalHandler = React.useCallback(() => {
    setGalleryItem(null);
  }, []);
  /******************************************** */

  return (
    <AppLayout>
      <ScrollToTop />
      <SiteHeadder stycky />
      <Main
        css={{
          minHeight: "100vh",
        }}
      >
        <Container
          css={(theme: FacadeGood.CustomTheme) => ({
            paddingTop: 100,
          })}
        >
          <Box>
            <CardButton
              onClick={() =>
                navigate("/", {
                  state: { scrollToAnchor: true, hash: "catalog" },
                })
              }
              dir="left"
            >
              Назад
            </CardButton>
          </Box>
          <Box css={{ marginBottom: 60 }}>
            <HeadTextWrapper>
              <HeadText
                css={(theme: FacadeGood.CustomTheme) => ({
                  fontSize: 32,
                  [theme.mq.desktop]: {
                    fontSize: 48,
                  },
                })}
              >
                Каталог фасадов - комплектующие.
              </HeadText>
            </HeadTextWrapper>
          </Box>
          <CatalogImages
            category="Комплектующие"
            setGalleryItem={setGalleryItem}
          />
        </Container>
      </Main>
      <GalleryModalWrapper item={galleryItem} onClose={onCloseModalHandler} />
      <SiteFooter />
    </AppLayout>
  );
};

export default AccessoriesPage;

export const Head: HeadFC = () => (
  <SEO title="Facade Good - Каталог комплектующие" />
);
