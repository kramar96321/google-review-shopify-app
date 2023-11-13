import React, { useState, useCallback } from "react";
import { useFindFirst, useQuery } from "@gadgetinc/react";
import {
  Card,
  ChoiceList,
  MediaCard,
  VideoThumbnail,
  FooterHelp,
  FormLayout,
  TextField,
  InlineStack,
  InlineGrid,
  Icon,
  Layout,
  Link,
  Page,
  Spinner,
  Select,
  Text,
  BlockStack,
  ButtonGroup,
  Button,
  Frame,
  Modal,
  Checkbox
} from "@shopify/polaris";
import { StoreMajor } from "@shopify/polaris-icons";
import { GoogleLogin, googleLogout, hasGrantedAllScopesGoogle, useGoogleLogin  } from '@react-oauth/google';
import { api } from "./api";
import GooglePlace from "./GooglePlace";
import { widgetOptions, themeOptions, locationOptions, alignmentOptions, reviewRatingLevelOptions } from "./constants";
import { useEffect } from "react";

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
    }
  }
`;

const ShopPage = () => {
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: gadgetMetaQuery,
  });
  const [reviewType, setReviewType] = useState('business_review');
  const [searchBusiness, setSearchBusiness] = useState(false);
  const handleReviewTypeChange = useCallback((value) => {
    setReviewType(value);
    setSearchBusiness(false);
  });
  const handleSearchBusinessClick = useCallback(() => setSearchBusiness(!searchBusiness));

  const [manualWidgetModalOpen, setManualWidgetModalOpen] = useState(false);
  const handleManualWidgetModalClick = useCallback(() => setManualWidgetModalOpen(!manualWidgetModalOpen), [manualWidgetModalOpen]);

  const [widgetOptionSelected, setWidgetOptionSelected] = useState('compact_rating');
  const handleWidgetOptionChange = useCallback((value) => setWidgetOptionSelected(value), [widgetOptionSelected]);

  const [themeOptionSelected, setThemeOptionSelected] = useState('light');
  const handleThemeOptionChange = useCallback((value) => setThemeOptionSelected(value), [themeOptionSelected]);

  const [locationOptionSelected, setLocationOptionSelected] = useState('top');
  const handleLocationOptionChange = useCallback((value) => setLocationOptionSelected(value), [locationOptionSelected]);

  const [alignmentOptionSelected, setAlignmentOptionSelected] = useState('center');
  const handleAlignmentOptionChange = useCallback((value) => setAlignmentOptionSelected(value), [alignmentOptionSelected]);

  const [minimizeChecked, setMinimizeChecked] = useState(false);
  const handleMinimizeChange = useCallback((minimizeChecked) => setMinimizeChecked(minimizeChecked), []);

  const [autoScrollChecked, setAutoScrollChecked] = useState(true);
  const handleAutoScrollChange = useCallback((autoScrollChecked) => setAutoScrollChecked(autoScrollChecked), []);

  const [showRatingChecked, setShowRatingChecked] = useState(true);
  const handleShowRatingChange = useCallback((showRatingChecked) => setShowRatingChecked(showRatingChecked), []);

  const [showReviewPhotosChecked, setShowReviewPhotosChecked] = useState(true);
  const handleShowReviewPhotosChange = useCallback((showReviewPhotosChecked) => setShowReviewPhotosChecked(showReviewPhotosChecked), []);

  const [showReviewPromptButtonChecked, setShowReviewPromptButtonChecked] = useState(true);
  const handleShowReviewPromptButtonChange = useCallback((showReviewPromptButtonChecked) => setShowReviewPromptButtonChecked(showReviewPromptButtonChecked), []);

  const [widgetCode, setWidgetCode] = useState("");

  const [reviewRatingLevelSelected, setReviewRatingLevelSelected] = useState(4);
  const handleReviewRatingLevelChange = useCallback((reviewRatingLevelSelected) => setReviewRatingLevelSelected(reviewRatingLevelSelected), []);

  if (error) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || fetchingGadgetMeta) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner" size="large" />
      </div>
    );
  }

  return (
    <Page title="Google Review Importer">
      <Layout>
        <Layout.Section>
          <MediaCard
            title="Enhance credibility with Google reviews"
            description="Boost sales using your Google Maps or Google Shopping reviews. Keep your reviews up-to-date with real-time synchronization."
            popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
          >
            <VideoThumbnail
              videoLength={80}
              thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
              onClick={() => console.log('clicked')}
            />
          </MediaCard>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h6">
                Step 1. Specify your Google Business
              </Text>
              <ChoiceList
                title="What kind of Google Reviews do you want to display?"
                choices={[
                  { label: 'Google My Business Reviews (Google Maps Reviews)', value: 'business_review' },
                  { label: 'Google Shopping Reviews (Google Merchant Reviews)', value: 'shopping_review' },
                ]}
                selected={reviewType}
                onChange={handleReviewTypeChange}
              />
              {reviewType == 'business_review' && !searchBusiness && (
                <GooglePlace email={data['email']} handleSearchBusinessClick={handleSearchBusinessClick}/>
              )}

              {reviewType == 'business_review' && searchBusiness && (
                <FormLayout>
                  <TextField
                    label="Search your Google Place:"
                    autoComplete="off"
                    connectedRight={<Button size="large" variant="primary">Search</Button>}
                  />
                  <Text as="p">
                    You can find your place by business name and address: country, city, street, ZIP, etc. For example: "Rockefeller Center, New York". If the place is not found you can locate and open it in&nbsp;
                    <Link url="https://www.google.com/maps">Google Maps</Link>
                    , copy the URL address from your browser and paste it here.
                  </Text>
                  <Card background="bg-surface-secondary">
                    <Text as="p">
                      Please be aware that in case of manual place search fewer reviews will be shown in your widget.&nbsp;
                      <Button
                        variant="plain"
                        onClick={handleSearchBusinessClick}
                      >
                        Signing in with Google
                      </Button>
                      &nbsp;is recommended for full compatibility.
                    </Text>
                  </Card>
                  <Text as="p">
                    If you don't have Google My Business account, you need to&nbsp;
                    <Link url="https://business.google.com/create">create it</Link>
                    &nbsp;first.
                  </Text>
                </FormLayout>
              )}

              {reviewType == 'shopping_review' && (
                <FormLayout>
                  <TextField
                    label="Enter your domain:"
                    placeholder="website.com"
                    autoComplete="off"
                    connectedRight={<Button size="large" variant="primary">Search</Button>}
                  />
                </FormLayout>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h6">
                Step 2. Add widgets to the storefront
              </Text>
              <div className="d-flex justify-content-between">
                <Text as="span">Add reviews widget to your website</Text>
                <Button className="pull-right">Add widget</Button>
              </div>
              <Text as="p">
                Learn&nbsp;<Link url="#">how to add widget</Link>&nbsp;in theme editor <br />
                Using vintage theme?&nbsp;
                <Button
                  variant="plain"
                  onClick={handleManualWidgetModalClick}
                >Add widget manually</Button>
              </Text>
              <Modal
                open={manualWidgetModalOpen}
                onClose={handleManualWidgetModalClick}
                title="Add widget code manually"
                primaryAction={{
                  content: 'Copy to clipboard',
                  // onAction: handleChange,
                }}
                secondaryActions={[
                  {
                    content: 'Learn how to embed code',
                    // onAction: handleChange,
                  }
                ]}
              >
                <Modal.Section>
                  <Select
                    label="Widget"
                    options={widgetOptions}
                    onChange={handleWidgetOptionChange}
                    value={widgetOptionSelected}
                  />
                  <Select
                    label="Theme"
                    options={themeOptions}
                    onChange={handleThemeOptionChange}
                    value={themeOptionSelected}
                  />
                  {(widgetOptionSelected == 'sticky_compact_rating' || widgetOptionSelected == 'sticky_slider') && (
                    <Select
                      label="Location"
                      options={locationOptions}
                      onChange={handleLocationOptionChange}
                      value={locationOptionSelected}
                    />
                  )}
                  {(widgetOptionSelected == 'sticky_compact_rating' || widgetOptionSelected == 'sticky_slider') && (
                    <Select
                      label="Alignment"
                      options={alignmentOptions}
                      onChange={handleAlignmentOptionChange}
                      value={alignmentOptionSelected}
                    />
                  )}
                  {(widgetOptionSelected == 'compact_rating' || widgetOptionSelected == 'sticky_compact_rating') && (
                    <div className="w-full">
                      <Checkbox
                        label="Minimize"
                        checked={minimizeChecked}
                        onChange={handleMinimizeChange}
                      />
                    </div>
                  )}
                  {widgetOptionSelected == 'carousel_reviews' && (
                    <div className="w-full">
                      <Checkbox
                        label="Auto Scroll"
                        checked={autoScrollChecked}
                        onChange={handleAutoScrollChange}
                      />
                    </div>
                  )}
                  {widgetOptionSelected == 'carousel_reviews' && (
                    <div className="w-full">
                      <Checkbox
                        label="Show Rating"
                        checked={showRatingChecked}
                        onChange={handleShowRatingChange}
                      />
                    </div>
                  )}
                  {(widgetOptionSelected == 'carousel_reviews' || widgetOptionSelected == 'grid_reviews') && (
                    <div className="w-full">
                      <Checkbox
                        label="Show review photos"
                        checked={showReviewPhotosChecked}
                        onChange={handleShowReviewPhotosChange}
                      />
                    </div>
                  )}
                  {(widgetOptionSelected == 'carousel_reviews' || widgetOptionSelected == 'grid_reviews') && (
                    <div className="w-full">
                      <Checkbox
                        label="Show the review prompt button"
                        checked={showReviewPromptButtonChecked}
                        onChange={handleShowReviewPromptButtonChange}
                      />
                    </div>
                  )}
                  <br />
                  <Text as="p">Preview:</Text>
                  <img className="w-full" />
                  <TextField
                    label="Code:"
                    value={widgetCode}
                    readOnly={true}
                    multiline={10}
                    autoComplete="off"
                  />
                </Modal.Section>
              </Modal>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h6">
                Step 3. Customize widgets
              </Text>
              <div className="d-flex justify-content-between">
                <Text as="span">
                  Min review rating to display
                </Text>
                <Select
                  options={reviewRatingLevelOptions}
                  onChange={handleReviewRatingLevelChange}
                  value={reviewRatingLevelSelected}
                />
              </div>
              <div className="d-flex justify-content-between">
                {/* <Text as="span">
                  Don't show "Translated by Google"
                </Text>
                <Checkbox
                  checked={translatedChecked}
                  onChange={handleShowReviewPromptButtonChange}
                /> */}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
