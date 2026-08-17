import React from "react";
import { Spinner } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import "./Config.scss";
import { useTranslation } from "react-i18next";
import { IconInfo } from "@humansignal/icons";
import { Button } from "@humansignal/ui";

const listClass = cn("templates-list");

const GROUP_TRANSLATION_KEYS = {
  "Computer Vision": "computerVision",
  "Natural Language Processing": "naturalLanguageProcessing",
  "Audio/Speech Processing": "audioSpeechProcessing",
  "Conversational AI": "conversationalAI",
  Chat: "chat",
  "Ranking & Scoring": "rankingAndScoring",
  "Structured Data Parsing": "structuredDataParsing",
  "Time Series Analysis": "timeSeriesAnalysis",
  Videos: "videos",
  "Generative AI": "generativeAI",
  "Community Contributions": "communityContributions",
};

const getGroupLabel = (group, t) => {
  const key = GROUP_TRANSLATION_KEYS[group];
  return key ? t(`labeling.groups.${key}`) : group;
};

const TEMPLATE_TITLE_KEYS = {
  "Automatic Speech Recognition": "automaticSpeechRecognition",
  "Automatic Speech Recognition using Segments": "automaticSpeechRecognitionUsingSegments",
  "Conversational Analysis": "conversationalAnalysis",
  "Intent Classification": "intentClassification",
  "Signal Quality Detection": "signalQualityDetection",
  "Sound Event Detection": "soundEventDetection",
  "Speaker Segmentation": "speakerSegmentation",
  "Speech Transcription": "speechTranscription",
  "Chatbot Evaluation": "chatbotEvaluation",
  "Fine-Tune an Agent without an LLM": "fineTuneAnAgentWithoutAnLlm",
  "Fine-Tune an Agent with an LLM": "fineTuneAnAgentWithAnLlm",
  "Red-Teaming in Chat": "redTeamingInChat",
  "Evaluate Production Conversations for RLHF": "evaluateProductionConversationsForRlhf",
  "Breast Cancer Mammogram Classification": "breastCancerMammogramClassification",
  "HTML NER Tagging": "htmlNerTagging",
  "NER Tagging for Invoices (BIO Format)": "nerTaggingForInvoicesBioFormat",
  "OCR Invoices Pre-NER BIO Format": "ocrInvoicesPreNerBioFormat",
  "Two-Level Sentiment Analysis of X / Twitter posts": "twoLevelSentimentAnalysisOfXTwitterPosts",
  "Image Captioning": "imageCaptioning",
  "Image Classification": "imageClassification",
  "Inventory Tracking": "inventoryTracking",
  "Keypoint Labeling": "keypointLabeling",
  "Medical Image Classification with Bounding Boxes": "medicalImageClassificationWithBoundingBoxes",
  "Multi-page document annotation": "multiPageDocumentAnnotation",
  "Object Detection with Bounding Boxes": "objectDetectionWithBoundingBoxes",
  "Optical Character Recognition": "opticalCharacterRecognition",
  "OCR Labeling for PDFs": "ocrLabelingForPdfs",
  "Semantic Segmentation with Masks": "semanticSegmentationWithMasks",
  "Semantic Segmentation with Polygons": "semanticSegmentationWithPolygons",
  "Visual Genome": "visualGenome",
  "Visual Question Answering": "visualQuestionAnswering",
  "Coreference Resolution & Entity Linking": "coreferenceResolutionAndEntityLinking",
  "Intent Classification and Slot Filling": "intentClassificationAndSlotFilling",
  "Response Generation": "responseGeneration",
  "Response Selection": "responseSelection",
  "Chatbot Model Assessment": "chatbotModelAssessment",
  "Human Preference collection for RLHF": "humanPreferenceCollectionForRlhf",
  "LLM Ranker": "llmRanker",
  "LLM Response Grading": "llmResponseGrading",
  "Supervised Language Model Fine-tuning": "supervisedLanguageModelFineTuning",
  "Visual Ranker": "visualRanker",
  "Content Moderation": "contentModeration",
  "Machine Translation": "machineTranslation",
  "Named Entity Recognition": "namedEntityRecognition",
  "Question Answering": "questionAnswering",
  "Relation Extraction": "relationExtraction",
  Taxonomy: "taxonomy",
  "Text Classification": "textClassification",
  "Text Summarization": "textSummarization",
  "ASR Hypotheses Selection": "asrHypothesesSelection",
  "Content-based Image Retrieval": "contentBasedImageRetrieval",
  "Document Retrieval": "documentRetrieval",
  "Pairwise classification": "pairwiseClassification",
  "Pairwise regression": "pairwiseRegression",
  "Search Page Ranking": "searchPageRanking",
  "Text-to-Image Generation": "textToImageGeneration",
  "Freeform Metadata": "freeformMetadata",
  "HTML Entity Recognition": "htmlEntityRecognition",
  "PDF Classification": "pdfClassification",
  "Tabular Data": "tabularData",
  "Activity Recognition": "activityRecognition",
  "Change Point Detection": "changePointDetection",
  "Outliers & Anomaly Detection": "outliersAndAnomalyDetection",
  "Signal Quality": "signalQuality",
  "Time Series Forecasting": "timeSeriesForecasting",
  "Video Classification": "videoClassification",
  "Video Frame Classification": "videoFrameClassification",
  "Video Object Tracking": "videoObjectTracking",
  "Video Timeline Segmentation": "videoTimelineSegmentation",
};

const getTemplateTitle = (title, t) => {
  const key = TEMPLATE_TITLE_KEYS[title];
  return key ? t(`labeling.templateTitles.${key}`) : title;
};

const Arrow = ({ title }) => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {title && <title>{title}</title>}
    <path opacity="0.9" d="M2 10L6 6L2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const TemplatesInGroup = ({ templates, group, onSelectRecipe, isEdition }) => {
  const { t } = useTranslation();
  const isCommunityEdition = isEdition === "Community";
  const picked = templates
    .filter((recipe) => recipe.group === group)
    .filter((recipe) => !(isCommunityEdition && recipe.type === "enterprise"))
    // templates without `order` go to the end of the list
    .sort((a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY));

  return (
    <ul>
      {picked.map((recipe) => (
        <li
          key={recipe.title}
          onClick={() => onSelectRecipe(recipe)}
          className={listClass.elem("template").toClassName()}
        >
          <img src={recipe.image} alt={""} />
          <div className="flex flex-col items-center w-full">
            <h3 className="flex flex-1 justify-center text-center w-full">{getTemplateTitle(recipe.title, t)}</h3>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const TemplatesList = ({ selectedGroup, selectedRecipe, onCustomTemplate, onSelectGroup, onSelectRecipe }) => {
  const { t } = useTranslation();
  const [groups, setGroups] = React.useState([]);
  const [templates, setTemplates] = React.useState();
  const api = useAPI();
  const isEdition = window?.APP_SETTINGS?.version_edition;

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await api.callApi("configTemplates");

      if (!res) return;
      const { templates, groups } = res;

      setTemplates(templates);
      setGroups(groups);
    };
    fetchData();
  }, []);

  const selected = selectedGroup || groups[0];

  return (
    <div className={listClass}>
      <aside className={listClass.elem("sidebar").toClassName()}>
        <ul>
          {groups.map((group) => (
            <li
              key={group}
              onClick={() => onSelectGroup(group)}
              className={listClass
                .elem("group")
                .mod({
                  active: selected === group,
                  selected: selectedRecipe?.group === group,
                })
                .toClassName()}
            >
              {getGroupLabel(group, t)}
              <Arrow title={t("labeling.arrowIcon")} />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          align="left"
          look="string"
          size="small"
          onClick={onCustomTemplate}
          className="w-full"
          aria-label={t("labeling.templates.createCustomTemplate")}
        >
          {t("labeling.templates.customTemplate")}
        </Button>
      </aside>
      <main>
        {!templates && <Spinner style={{ width: "100%", height: 200 }} />}
        <TemplatesInGroup
          templates={templates || []}
          group={selected}
          onSelectRecipe={onSelectRecipe}
          isEdition={isEdition}
        />
      </main>
      <footer className="flex items-center justify-center gap-1">
        <IconInfo className={listClass.elem("info-icon").toClassName()} width="20" height="20" />
        <span>{t("labeling.templates.contributeTemplate")}</span>
      </footer>
    </div>
  );
};
