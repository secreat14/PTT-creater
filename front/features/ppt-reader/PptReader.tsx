import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent as ReactChangeEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Focus,
  Folder,
  FolderOpen,
  ImagePlus,
  Maximize2,
  MessageSquareText,
  Minus,
  Move,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plus,
  Presentation,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Type,
  Undo2,
  X,
} from 'lucide-react';
import './ppt-reader.css';

type ReaderTab = 'summary' | 'text' | 'analysis' | 'edit';
type SlidePalette = 'ink' | 'sage' | 'clay' | 'blue';
type TextBoxRole = 'eyebrow' | 'title' | 'summary' | 'bullet' | 'tags' | 'custom';
type TextBoxTone = 'foreground' | 'accent' | 'muted';
type SlideTextBox = {
  id: string;
  role: TextBoxRole;
  sourceIndex?: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  bold: boolean;
  align: 'left' | 'center' | 'right';
  tone: TextBoxTone;
};
type SlideImage = {
  id: string;
  name: string;
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type PptFileHandle = {
  kind: 'file';
  name: string;
};

type PptDirectoryHandle = {
  kind: 'directory';
  name: string;
  values: () => AsyncIterableIterator<PptDirectoryHandle | PptFileHandle>;
};

type PptBrowserEntry = {
  kind: 'directory' | 'ppt';
  name: string;
  handle?: PptDirectoryHandle | PptFileHandle;
};

type Slide = {
  number: number;
  section: string;
  eyebrow: string;
  title: string;
  summary: string;
  bullets: string[];
  tags: string[];
  palette: SlidePalette;
  note: string;
  textBoxes?: SlideTextBox[];
  images?: SlideImage[];
};

type SpeakerAnalysis = {
  purpose: string;
  suggestedScript: string;
  keyPoints: string[];
  opening: string;
  development: string;
  transition: string;
  duration: string;
  wordTarget: number;
};

function buildSpeakerAnalysis(slide: Slide, nextSlide?: Slide): SpeakerAnalysis {
  const keyPoints = slide.bullets.filter(Boolean).slice(0, 3);
  const pointNames = keyPoints.map(item => `“${item}”`).join('、');
  const wordTarget = Math.max(140, Math.min(240, 110 + keyPoints.length * 25));
  const seconds = Math.round(wordTarget / 2);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return {
    purpose: `本页位于“${slide.section}”部分，核心任务是让听众理解“${slide.title}”以及它与整体方案的关系。`,
    suggestedScript: `这一页主要介绍“${slide.title}”。${slide.summary}${slide.note}`,
    keyPoints,
    opening: `先用一句话点明本页主题：${slide.summary}`,
    development: pointNames
      ? `随后围绕 ${pointNames} 依次展开，每个要点配一个简短解释，避免只照读页面。`
      : '随后按页面信息的先后关系展开，并补充一个具体例子帮助听众理解。',
    transition: nextSlide
      ? `收束本页结论后，用“接下来我们看${nextSlide.title}”自然过渡到下一页。`
      : '最后回扣整套方案的核心价值，并邀请听众围绕实际应用继续讨论。',
    duration: `${String(minutes).padStart(2, '0')}:${remainingSeconds}`,
    wordTarget,
  };
}

const slides: Slide[] = [
  {
    number: 1,
    section: '教学问题与整体方案',
    eyebrow: 'PROJECT-BASED LEARNING',
    title: '商业模式设计项目化混合式教学方案',
    summary: '从强智、强能、强意、强创四个方向，回应商业思维、实践能力与课程思政中的真实教学问题。',
    bullets: ['融：学科 × 理念 × 技术', '接：课程 × 行业 × 项目', '构：价值 × 场景 × 体验', '挑：兴趣 × 能力 × 迁移'],
    tags: ['教学创新', '四维融合', '校企共建'],
    palette: 'ink',
    note: '开场先建立课程改革的完整问题框架，再说明四条创新路径之间的关系。',
  },
  {
    number: 2,
    section: '教学问题与整体方案',
    eyebrow: 'LEARNING ECOSYSTEM',
    title: '多平台协同的数字化学习生态',
    summary: '课程资源、学习工具和教学平台共同支撑研究、融通、分析、拓展与思辨。',
    bullets: ['国家智慧教育平台', '超星泛雅与云课堂', '经典文本与多模态作品', '知识图谱与实时数据'],
    tags: ['数字资源', '学习生态', '多模态'],
    palette: 'sage',
    note: '强调平台不是内容堆叠，而是围绕学习活动形成可追踪的资源闭环。',
  },
  {
    number: 3,
    section: '教学问题与整体方案',
    eyebrow: 'CLASSROOM DESIGN',
    title: '学生、课堂与教师三位一体',
    summary: '课前案例导入、课中实时互动，以真实问题推动探究、分析、讨论与互评。',
    bullets: ['真实问题导入', '分组讨论验证', '教师过程指导', '师生双向评价'],
    tags: ['以学生为中心', '课堂互动', '过程评价'],
    palette: 'blue',
    note: '通过角色关系图说明教师从讲授者转向活动设计者与学习指导者。',
  },
  {
    number: 4,
    section: '教学问题与整体方案',
    eyebrow: 'COURSE OVERVIEW',
    title: '理论联系实际，培养商业思维',
    summary: '围绕商业模式、创新路径与 TCH 矩阵，构建教学内容、目标、方法、过程与评价的一体化设计。',
    bullets: ['TCH 矩阵分析法', '小米与用友案例', '德育融入课堂', '商业思维迁移'],
    tags: ['课程目标', '案例教学', '立德树人'],
    palette: 'clay',
    note: '本页是课程导航页，适合快速交代本次教学设计的完整结构。',
  },
  {
    number: 5,
    section: '教学方法与创新路径',
    eyebrow: 'BOPPPS MODEL',
    title: '基于 BOPPPS 的课前学习设计',
    summary: '通过前测、精准推送、线上自学与在线作业，建立学习反馈与知识巩固闭环。',
    bullets: ['问卷调查前测', '精准资源推送', '章节微课自学', '在线作业反馈'],
    tags: ['BOPPPS', '课前学习', '精准教学'],
    palette: 'sage',
    note: '可按“诊断—学习—巩固—反馈”的顺序讲解课前环节。',
  },
  {
    number: 6,
    section: '教学方法与创新路径',
    eyebrow: 'IQEI FRAMEWORK',
    title: '兴趣—问题—探索—创新',
    summary: '以实践项目为载体，将知识点、思政点和项目任务串联为可持续推进的学习路径。',
    bullets: ['Interests 兴趣', 'Question 问题', 'Explore 探索', 'Innovate 创新'],
    tags: ['IQEI', '项目驱动', '三创任务'],
    palette: 'ink',
    note: '这是核心方法页，可逐层展开四阶段，并对应课前、课中、课后活动。',
  },
  {
    number: 7,
    section: '教学方法与创新路径',
    eyebrow: 'INNOVATION SUMMARY',
    title: '一体两翼三阶：创新路径与效果',
    summary: '以商业模式分析体系为主体，以学科前沿和本土案例为两翼，形成递进式能力培养。',
    bullets: ['懂理论：知识传授', '强应用：实践能力', '会创新：高阶思维', '善协作：沟通合作'],
    tags: ['一体两翼', '三阶能力', '多元评价'],
    palette: 'clay',
    note: '总结设计亮点，并把创新措施映射到学生的可观察学习成果。',
  },
  {
    number: 8,
    section: '教学流程与评价体系',
    eyebrow: 'BLENDED LEARNING',
    title: '以 TCH 矩阵为核心的混合式教学',
    summary: '从理解、应用、分析、评估到创造，线上线下活动共同支撑认知层级进阶。',
    bullets: ['课前自学与随堂测试', '案例分析与主题讨论', '小组协作与能力锻炼', '学习反思与成果创造'],
    tags: ['混合式教学', '认知进阶', 'TCH 矩阵'],
    palette: 'blue',
    note: '可结合布鲁姆认知层级解释不同活动为什么安排在线上或线下。',
  },
  {
    number: 9,
    section: '教学流程与评价体系',
    eyebrow: 'LEARNING JOURNEY',
    title: '课前—课中—课后的完整学习旅程',
    summary: '线上理解方法，线下剖析案例，课后将方法迁移到学生自己的商业模式设计。',
    bullets: ['课前：理解定位与迁移', '课中：剖析小米、用友案例', '课后：设计个人商业模式', '贯穿：思辨、对话与论证'],
    tags: ['教学流程', '案例实践', '知识迁移'],
    palette: 'sage',
    note: '用一条连续的学习旅程呈现三阶段目标和学生任务。',
  },
  {
    number: 10,
    section: '教学流程与评价体系',
    eyebrow: 'ASSESSMENT SYSTEM',
    title: '诊断、形成、终结与增值评价',
    summary: '平台数据、课堂表现、期末考试与项目实践共同组成多主体、多维度评价体系。',
    bullets: ['诊断性评价 20%', '形成性评价 40%', '终结性评价 30%', '增值性评价 10%'],
    tags: ['多元评价', '实时反馈', '能力达成'],
    palette: 'clay',
    note: '讲解时先说明四类评价的时间位置，再对应评价主体、指标与反馈方式。',
  },
  {
    number: 11,
    section: '课程资源与案例体系',
    eyebrow: 'RESOURCE MATRIX',
    title: '开放资源与自建资源协同',
    summary: '一流课程、经典案例、学科前沿与知识图谱共同构成可复用的课程资源矩阵。',
    bullets: ['在线课程与电子书', '微课、有声书与课件', '案例报告与思维导图', '科研项目与知识图谱'],
    tags: ['课程资源', '知识图谱', '共建共享'],
    palette: 'blue',
    note: '突出资源之间的组织关系，而不是仅罗列资源数量。',
  },
  {
    number: 12,
    section: '课程资源与案例体系',
    eyebrow: 'COURSE MAP',
    title: '商业模式设计与创新实战课程',
    summary: '从概念与基础分析进入创新路径，再通过 TCH 矩阵和企业案例完成综合迁移。',
    bullets: ['01 商业模式概念', '02 商业模式创新', '03 TCH 矩阵方法', '04–06 企业案例与综合对比'],
    tags: ['课程地图', '企业案例', '实战应用'],
    palette: 'ink',
    note: '收束全套课件，并给出后续学习路径和案例分析顺序。',
  },
];

const sectionOrder = [...new Set(slides.map(slide => slide.section))];
const PRESENTER_CHANNEL = 'ppt-deep-reader-presenter-v1';
const DEMO_PPT_NAME = '商业模式设计分析方法—TCH矩阵.pptx';
function createDefaultTextBoxes(slide: Slide): SlideTextBox[] {
  const boxes: SlideTextBox[] = [
    { id: 'eyebrow', role: 'eyebrow', content: slide.eyebrow, x: 5.6, y: 22, width: 50, height: 6, fontSize: 10, bold: true, align: 'left', tone: 'accent' },
    { id: 'title', role: 'title', content: slide.title, x: 5.6, y: 30, width: 51, height: 27, fontSize: 36, bold: true, align: 'left', tone: 'foreground' },
    { id: 'summary', role: 'summary', content: slide.summary, x: 5.6, y: 61, width: 48, height: 16, fontSize: 12, bold: false, align: 'left', tone: 'muted' },
    ...slide.bullets.map((content, index): SlideTextBox => ({
      id: `bullet-${index}`,
      role: 'bullet',
      sourceIndex: index,
      content,
      x: 60,
      y: 30 + index * 11.4,
      width: 34,
      height: 9.5,
      fontSize: 11,
      bold: true,
      align: 'left',
      tone: 'foreground',
    })),
    { id: 'tags', role: 'tags', content: slide.tags.join('  ·  '), x: 60, y: 91.5, width: 34, height: 4, fontSize: 7, bold: true, align: 'right', tone: 'muted' },
  ];
  return boxes;
}

function cloneSlides(source: Slide[]) {
  return source.map(slide => ({
    ...slide,
    bullets: [...slide.bullets],
    tags: [...slide.tags],
    textBoxes: (slide.textBoxes ?? createDefaultTextBoxes(slide)).map(box => ({ ...box })),
    images: slide.images?.map(image => ({ ...image })) ?? [],
  }));
}

function isSlideDeck(value: unknown): value is Slide[] {
  return Array.isArray(value) && value.length === slides.length && value.every(item => {
    if (!item || typeof item !== 'object') return false;
    const slide = item as Partial<Slide>;
    return typeof slide.number === 'number'
      && typeof slide.section === 'string'
      && typeof slide.eyebrow === 'string'
      && typeof slide.title === 'string'
      && typeof slide.summary === 'string'
      && typeof slide.note === 'string'
      && ['ink', 'sage', 'clay', 'blue'].includes(slide.palette ?? '')
      && Array.isArray(slide.bullets)
      && slide.bullets.every(bullet => typeof bullet === 'string')
      && Array.isArray(slide.tags)
      && slide.tags.every(tag => typeof tag === 'string')
      && (!slide.textBoxes || (Array.isArray(slide.textBoxes) && slide.textBoxes.every(box => (
        typeof box.id === 'string'
        && typeof box.content === 'string'
        && ['eyebrow', 'title', 'summary', 'bullet', 'tags', 'custom'].includes(box.role)
        && Number.isFinite(box.x)
        && Number.isFinite(box.y)
        && Number.isFinite(box.width)
        && Number.isFinite(box.height)
        && Number.isFinite(box.fontSize)
      ))))
      && (!slide.images || (Array.isArray(slide.images) && slide.images.every(image => (
        typeof image.id === 'string'
        && typeof image.name === 'string'
        && typeof image.src === 'string'
        && typeof image.alt === 'string'
        && Number.isFinite(image.x)
        && Number.isFinite(image.y)
        && Number.isFinite(image.width)
        && Number.isFinite(image.height)
      ))))
      ;
  });
}

function isPptFile(name: string) {
  return /\.pptx?$/i.test(name);
}

async function readPptDirectory(handle: PptDirectoryHandle) {
  const entries: PptBrowserEntry[] = [];
  for await (const entry of handle.values()) {
    if (entry.kind === 'directory') entries.push({ kind: 'directory', name: entry.name, handle: entry });
    if (entry.kind === 'file' && isPptFile(entry.name)) entries.push({ kind: 'ppt', name: entry.name, handle: entry });
  }
  return entries.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === 'directory' ? -1 : 1;
    return left.name.localeCompare(right.name, 'zh-CN', { numeric: true, sensitivity: 'base' });
  });
}

function clampSlide(value: number) {
  return Math.max(0, Math.min(slides.length - 1, value));
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

type SlideArtworkProps = {
  slide: Slide;
  compact?: boolean;
  editable?: boolean;
  selectedTextBoxId?: string | null;
  selectedImageId?: string | null;
  editingTextBoxId?: string | null;
  onTextBoxPointerDown?: (textBoxId: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  onTextBoxPointerMove?: (event: ReactPointerEvent<HTMLElement>) => void;
  onTextBoxPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onTextBoxDoubleClick?: (textBoxId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onTextBoxCommit?: (textBoxId: string, value: string) => void;
  onTextBoxResizePointerDown?: (textBoxId: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onExitInlineEditing?: () => void;
  onImagePointerDown?: (imageId: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  onImagePointerMove?: (event: ReactPointerEvent<HTMLElement>) => void;
  onImagePointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onImageDoubleClick?: (imageId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onImageResizePointerDown?: (imageId: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
};

function SlideArtwork({
  slide,
  compact = false,
  editable = false,
  selectedTextBoxId,
  selectedImageId,
  editingTextBoxId,
  onTextBoxPointerDown,
  onTextBoxPointerMove,
  onTextBoxPointerUp,
  onTextBoxDoubleClick,
  onTextBoxCommit,
  onTextBoxResizePointerDown,
  onExitInlineEditing,
  onImagePointerDown,
  onImagePointerMove,
  onImagePointerUp,
  onImageDoubleClick,
  onImageResizePointerDown,
}: SlideArtworkProps) {
  const textBoxes = slide.textBoxes ?? createDefaultTextBoxes(slide);
  return (
    <div className={`ppt-slide-art palette-${slide.palette}${compact ? ' is-compact' : ''}${editable ? ' is-editing' : ''}`}>
      <div className="ppt-slide-grid" aria-hidden="true" />
      <div className="ppt-slide-brand"><span /> TCH / 课程设计</div>
      <div className="ppt-slide-number">{String(slide.number).padStart(2, '0')}</div>
      {(slide.images ?? []).map(image => (
        <div
          key={image.id}
          className={`ppt-slide-image${editable ? ' is-editable' : ''}${selectedImageId === image.id ? ' is-selected' : ''}`}
          style={{ left: `${image.x}%`, top: `${image.y}%`, width: `${image.width}%`, height: `${image.height}%` }}
          onPointerDown={editable ? event => onImagePointerDown?.(image.id, event) : undefined}
          onPointerMove={editable ? onImagePointerMove : undefined}
          onPointerUp={editable ? onImagePointerUp : undefined}
          onPointerCancel={editable ? onImagePointerUp : undefined}
          onDoubleClick={editable ? event => onImageDoubleClick?.(image.id, event) : undefined}
        >
          <img src={image.src} alt={image.alt} draggable={false} />
          {editable && selectedImageId === image.id && <>
            <b className="ppt-object-badge">图片</b>
            <button
              className="ppt-image-resize"
              onPointerDown={event => onImageResizePointerDown?.(image.id, event)}
              onPointerMove={onImagePointerMove}
              onPointerUp={onImagePointerUp}
              onPointerCancel={onImagePointerUp}
              aria-label="拖动缩放图片"
              title="拖动缩放"
            />
          </>}
        </div>
      ))}
      {textBoxes.map(box => (
        <div
          key={box.id}
          className={`ppt-text-box role-${box.role} tone-${box.tone}${editable ? ' is-editable' : ''}${selectedTextBoxId === box.id && !selectedImageId ? ' is-selected' : ''}${editingTextBoxId === box.id ? ' is-text-editing' : ''}`}
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
            fontSize: `${box.fontSize}px`,
            fontWeight: box.bold ? 700 : 450,
            textAlign: box.align,
          }}
          onPointerDown={editable ? event => onTextBoxPointerDown?.(box.id, event) : undefined}
          onPointerMove={editable ? onTextBoxPointerMove : undefined}
          onPointerUp={editable ? onTextBoxPointerUp : undefined}
          onPointerCancel={editable ? onTextBoxPointerUp : undefined}
          onDoubleClick={editable ? event => onTextBoxDoubleClick?.(box.id, event) : undefined}
        >
          {box.role === 'bullet' && <small>{String((box.sourceIndex ?? 0) + 1).padStart(2, '0')}</small>}
          <span
            contentEditable={editable && editingTextBoxId === box.id}
            suppressContentEditableWarning
            onBlur={event => onTextBoxCommit?.(box.id, event.currentTarget.innerText.trim())}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.currentTarget.blur();
                onExitInlineEditing?.();
              }
            }}
          >{box.content}</span>
          {editable && selectedTextBoxId === box.id && !selectedImageId && <>
            <b className="ppt-object-badge">文本框 · 双击编辑</b>
            <button
              className="ppt-text-resize"
              onPointerDown={event => onTextBoxResizePointerDown?.(box.id, event)}
              onPointerMove={onTextBoxPointerMove}
              onPointerUp={onTextBoxPointerUp}
              onPointerCancel={onTextBoxPointerUp}
              aria-label="拖动调整文本框大小"
              title="拖动调整大小"
            />
          </>}
        </div>
      ))}
      {!compact && <div className="ppt-slide-footer"><span>BUSINESS MODEL DESIGN</span></div>}
    </div>
  );
}

function SpeakerAnalysisPanel({ slide, nextSlide }: { slide: Slide; nextSlide?: Slide }) {
  const analysis = buildSpeakerAnalysis(slide, nextSlide);

  return <div className="ppt-speaker-analysis">
    <section className="ppt-analysis-overview">
      <div className="ppt-analysis-label"><Focus size={13} /><span>内容介绍分析</span></div>
      <h3>{slide.title}</h3>
      <p>{slide.summary}</p>
      <small>{analysis.purpose}</small>
    </section>

    <section className="ppt-ai-speech-card">
      <div className="ppt-ai-speech-heading">
        <span><MessageSquareText size={14} />AI 演讲建议</span>
        <small>基于当前页内容</small>
      </div>
      <div className="ppt-speech-script">
        <span>建议这样讲</span>
        <p>{analysis.suggestedScript}</p>
      </div>
      <div className="ppt-speech-focus">
        <span>重点应该是</span>
        <ol>{analysis.keyPoints.map((item, index) => <li key={`${index}-${item}`}><b>{index + 1}</b><p>{item}</p></li>)}</ol>
      </div>
    </section>

    <section className="ppt-speaking-flow">
      <div className="ppt-speaking-flow-heading"><span>表达顺序</span><small>开场 → 展开 → 过渡</small></div>
      <ol>
        <li><b>开场</b><p>{analysis.opening}</p></li>
        <li><b>展开</b><p>{analysis.development}</p></li>
        <li><b>过渡</b><p>{analysis.transition}</p></li>
      </ol>
    </section>

    <div className="ppt-speaking-time"><span>建议时长</span><strong>{analysis.duration}</strong><small>建议约 {analysis.wordTarget} 字</small></div>
  </div>;
}

export function PptReader() {
  const [deckSlides, setDeckSlides] = useState<Slide[]>(() => cloneSlides(slides));
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(88);
  const [tab, setTab] = useState<ReaderTab>('summary');
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>('title');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [editingTextBoxId, setEditingTextBoxId] = useState<string | null>(null);
  const [replaceImageId, setReplaceImageId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState<Set<number>>(() => new Set([5]));
  const [notice, setNotice] = useState('');
  const [fileBrowserOpen, setFileBrowserOpen] = useState(true);
  const [fileTabTop, setFileTabTop] = useState(92);
  const [folderHistory, setFolderHistory] = useState<PptDirectoryHandle[]>([]);
  const [browserEntries, setBrowserEntries] = useState<PptBrowserEntry[]>([
    { kind: 'ppt', name: DEMO_PPT_NAME },
  ]);
  const [selectedPpt, setSelectedPpt] = useState(DEMO_PPT_NAME);
  const [folderLoading, setFolderLoading] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const presenterWindowRef = useRef<Window | null>(null);
  const syncOriginRef = useRef(`reader-${Math.random().toString(36).slice(2)}`);
  const deckSlidesRef = useRef(deckSlides);
  const fileTabDragRef = useRef<{ pointerId: number; startY: number; startTop: number; moved: boolean } | null>(null);
  const slideTextBoxDragRef = useRef<{
    pointerId: number;
    textBoxId: string;
    mode: 'move' | 'resize';
    startClientX: number;
    startClientY: number;
    startBox: SlideTextBox;
    slideWidth: number;
    slideHeight: number;
  } | null>(null);
  const slideImageDragRef = useRef<{
    pointerId: number;
    imageId: string;
    mode: 'move' | 'resize';
    startClientX: number;
    startClientY: number;
    startImage: SlideImage;
    slideWidth: number;
    slideHeight: number;
  } | null>(null);
  const suppressFileTabClickRef = useRef(false);

  deckSlidesRef.current = deckSlides;
  const slide = deckSlides[current];
  const slideTextBoxes = slide.textBoxes ?? createDefaultTextBoxes(slide);
  const selectedTextBox = slideTextBoxes.find(box => box.id === selectedTextBoxId) ?? null;
  const selectedImage = slide.images?.find(image => image.id === selectedImageId) ?? null;
  const isSlideModified = JSON.stringify(slide) !== JSON.stringify(cloneSlides([slides[current]])[0]);
  const matchingSlides = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return deckSlides;
    return deckSlides.filter(item => [item.title, item.summary, item.section, ...item.bullets, ...item.tags, ...(item.textBoxes ?? []).map(box => box.content)]
      .join(' ').toLocaleLowerCase().includes(normalized));
  }, [deckSlides, query]);

  const clampFileTabTop = (value: number) => {
    const reader = readerRef.current;
    const headerHeight = reader?.querySelector<HTMLElement>('.ppt-reader-header')?.offsetHeight ?? 72;
    const minimum = headerHeight + 8;
    const maximum = Math.max(minimum, (reader?.clientHeight ?? 620) - 78 - 8);
    return Math.min(maximum, Math.max(minimum, value));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedImageId) {
        setDeckSlides(items => items.map((item, index) => index === current
          ? { ...item, images: (item.images ?? []).filter(image => image.id !== selectedImageId) }
          : item));
        setSelectedImageId(null);
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedTextBoxId) {
        setDeckSlides(items => items.map((item, index) => index === current
          ? { ...item, textBoxes: (item.textBoxes ?? createDefaultTextBoxes(item)).filter(box => box.id !== selectedTextBoxId) }
          : item));
        setSelectedTextBoxId(null);
        return;
      }
      if (event.key === 'Escape') setEditingTextBoxId(null);
      if (event.key === 'ArrowLeft') setCurrent(value => Math.max(0, value - 1));
      if (event.key === 'ArrowRight') setCurrent(value => Math.min(deckSlidesRef.current.length - 1, value + 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current, selectedImageId, selectedTextBoxId]);

  useEffect(() => {
    setSelectedImageId(null);
    setSelectedTextBoxId('title');
    setEditingTextBoxId(null);
  }, [current]);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.onmessage = event => {
      if (event.data?.origin === syncOriginRef.current) return;
      if (event.data?.type === 'goto') {
        const next = Number(event.data.slide);
        if (Number.isInteger(next)) setCurrent(clampSlide(next));
      }
      if (event.data?.type === 'request-deck') {
        channel.postMessage({ type: 'deck', slides: deckSlidesRef.current, origin: syncOriginRef.current });
      }
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.postMessage({ type: 'goto', slide: current, origin: syncOriginRef.current });
    channel.close();
  }, [current]);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.postMessage({ type: 'deck', slides: deckSlides, origin: syncOriginRef.current });
    channel.close();
  }, [deckSlides]);

  useEffect(() => {
    const keepFileTabInView = () => setFileTabTop(value => clampFileTabTop(value));
    window.addEventListener('resize', keepFileTabInView);
    return () => window.removeEventListener('resize', keepFileTabInView);
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };
  const updateCurrentSlide = <K extends keyof Slide>(field: K, value: Slide[K]) => {
    setDeckSlides(items => items.map((item, index) => index === current ? { ...item, [field]: value } : item));
  };
  const startEditing = () => {
    setInspectorOpen(true);
    setTab('edit');
  };
  const finishEditing = () => {
    setEditingTextBoxId(null);
    setTab('summary');
    showNotice('本页修改已保留在当前会话中。');
  };
  const resetCurrentSlide = () => {
    setDeckSlides(items => items.map((item, index) => index === current
      ? cloneSlides([slides[index]])[0]
      : item));
    showNotice('已恢复本页的初始内容。');
  };

  const showFolder = async (handle: PptDirectoryHandle, history: PptDirectoryHandle[]) => {
    setFolderLoading(true);
    try {
      setBrowserEntries(await readPptDirectory(handle));
      setFolderHistory(history);
    } catch {
      showNotice('无法读取这个文件夹，请重新选择或检查浏览器权限。');
    } finally {
      setFolderLoading(false);
    }
  };
  const chooseFolder = async () => {
    const picker = (window as Window & { showDirectoryPicker?: () => Promise<PptDirectoryHandle> }).showDirectoryPicker;
    if (!picker) {
      showNotice('当前浏览器不支持文件夹浏览，请使用最新版 Chrome 或 Edge。');
      return;
    }
    try {
      const handle = await picker.call(window);
      await showFolder(handle, [handle]);
      setFileBrowserOpen(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showNotice('文件夹未能打开，请重试。');
    }
  };
  const openDirectory = async (entry: PptBrowserEntry) => {
    if (entry.kind !== 'directory' || entry.handle?.kind !== 'directory') return;
    await showFolder(entry.handle, [...folderHistory, entry.handle]);
  };
  const goToParentDirectory = async () => {
    if (folderHistory.length < 2) return;
    const history = folderHistory.slice(0, -1);
    await showFolder(history[history.length - 1], history);
  };
  const selectPpt = (entry: PptBrowserEntry) => {
    setSelectedPpt(entry.name);
    if (entry.name === DEMO_PPT_NAME && !entry.handle) return;
    showNotice(`已选择 ${entry.name}；文件内容解析将在下一阶段接入。`);
  };
  const openPresenter = () => {
    if (presenterWindowRef.current && !presenterWindowRef.current.closed) {
      presenterWindowRef.current.focus();
      return;
    }
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('mode', 'present');
    url.searchParams.set('slide', String(slide.number));
    url.hash = '';
    const presenter = window.open(url.toString(), 'ppt-deep-reader-presenter', 'popup=yes,width=1440,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (!presenter) {
      showNotice('浏览器拦截了演讲者窗口，请允许本站弹出窗口后重试。');
      return;
    }
    presenterWindowRef.current = presenter;
    presenter.focus();
  };
  const toggleBookmark = () => {
    setBookmarks(value => {
      const next = new Set(value);
      next.has(slide.number) ? next.delete(slide.number) : next.add(slide.number);
      return next;
    });
  };
  const enterFullscreen = async () => {
    try { await readerRef.current?.requestFullscreen(); } catch { showNotice('浏览器未允许进入全屏。'); }
  };
  const startFileTabDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    fileTabDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTop: fileTabTop,
      moved: false,
    };
  };
  const moveFileTab = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = fileTabDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientY - drag.startY;
    if (Math.abs(distance) > 3) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    setFileTabTop(clampFileTabTop(drag.startTop + distance));
  };
  const finishFileTabDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = fileTabDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressFileTabClickRef.current = drag.moved;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    fileTabDragRef.current = null;
    if (drag.moved) window.setTimeout(() => { suppressFileTabClickRef.current = false; }, 0);
  };
  const openFileSidebarFromTag = () => {
    if (suppressFileTabClickRef.current) {
      suppressFileTabClickRef.current = false;
      return;
    }
    setFileBrowserOpen(true);
  };
  const moveFileTabWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Home') setFileTabTop(clampFileTabTop(Number.NEGATIVE_INFINITY));
    else if (event.key === 'End') setFileTabTop(clampFileTabTop(Number.POSITIVE_INFINITY));
    else setFileTabTop(value => clampFileTabTop(value + (event.key === 'ArrowUp' ? -12 : 12)));
  };
  const clampTextBox = (box: SlideTextBox): SlideTextBox => {
    const width = Math.round(Math.max(5, Math.min(94, box.width)) * 10) / 10;
    const height = Math.round(Math.max(3, Math.min(88, box.height)) * 10) / 10;
    return {
      ...box,
      width,
      height,
      fontSize: Math.round(Math.max(6, Math.min(72, box.fontSize))),
      x: Math.round(Math.max(0, Math.min(100 - width, box.x)) * 10) / 10,
      y: Math.round(Math.max(0, Math.min(100 - height, box.y)) * 10) / 10,
    };
  };
  const updateCurrentTextBoxes = (updater: (boxes: SlideTextBox[]) => SlideTextBox[]) => {
    setDeckSlides(items => items.map((item, index) => index === current
      ? { ...item, textBoxes: updater((item.textBoxes ?? createDefaultTextBoxes(item)).map(box => ({ ...box }))) }
      : item));
  };
  const updateTextBox = (textBoxId: string, changes: Partial<SlideTextBox>) => {
    updateCurrentTextBoxes(boxes => boxes.map(box => box.id === textBoxId ? clampTextBox({ ...box, ...changes }) : box));
  };
  const syncSemanticContent = (box: SlideTextBox, content: string) => {
    if (box.role === 'eyebrow') updateCurrentSlide('eyebrow', content);
    if (box.role === 'title') updateCurrentSlide('title', content);
    if (box.role === 'summary') updateCurrentSlide('summary', content);
    if (box.role === 'bullet' && box.sourceIndex !== undefined) {
      updateCurrentSlide('bullets', slide.bullets.map((item, index) => index === box.sourceIndex ? content : item));
    }
    if (box.role === 'tags') {
      updateCurrentSlide('tags', content.split(/[·，,]/).map(tag => tag.trim()).filter(Boolean).slice(0, 6));
    }
  };
  const commitTextBox = (textBoxId: string, content: string) => {
    const box = slideTextBoxes.find(item => item.id === textBoxId);
    if (!box) return;
    updateTextBox(textBoxId, { content });
    syncSemanticContent(box, content);
  };
  const startTextBoxDrag = (textBoxId: string, event: ReactPointerEvent<HTMLDivElement>) => {
    if (tab !== 'edit' || event.button !== 0) return;
    setSelectedImageId(null);
    setSelectedTextBoxId(textBoxId);
    if (editingTextBoxId === textBoxId && event.target instanceof HTMLElement && event.target.isContentEditable) return;
    const box = slideTextBoxes.find(item => item.id === textBoxId);
    const artwork = event.currentTarget.closest<HTMLElement>('.ppt-slide-art');
    if (!box || !artwork) return;
    const bounds = artwork.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    slideTextBoxDragRef.current = {
      pointerId: event.pointerId,
      textBoxId,
      mode: 'move',
      startClientX: event.clientX,
      startClientY: event.clientY,
      startBox: { ...box },
      slideWidth: bounds.width,
      slideHeight: bounds.height,
    };
    event.preventDefault();
    event.stopPropagation();
  };
  const startTextBoxResize = (textBoxId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const box = slideTextBoxes.find(item => item.id === textBoxId);
    const artwork = event.currentTarget.closest<HTMLElement>('.ppt-slide-art');
    if (!box || !artwork) return;
    const bounds = artwork.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    slideTextBoxDragRef.current = {
      pointerId: event.pointerId,
      textBoxId,
      mode: 'resize',
      startClientX: event.clientX,
      startClientY: event.clientY,
      startBox: { ...box },
      slideWidth: bounds.width,
      slideHeight: bounds.height,
    };
    event.preventDefault();
    event.stopPropagation();
  };
  const moveTextBox = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = slideTextBoxDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = ((event.clientX - drag.startClientX) / drag.slideWidth) * 100;
    const dy = ((event.clientY - drag.startClientY) / drag.slideHeight) * 100;
    updateTextBox(drag.textBoxId, drag.mode === 'move'
      ? { x: drag.startBox.x + dx, y: drag.startBox.y + dy }
      : { width: drag.startBox.width + dx, height: drag.startBox.height + dy });
    event.preventDefault();
    event.stopPropagation();
  };
  const finishTextBoxDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = slideTextBoxDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    slideTextBoxDragRef.current = null;
    event.stopPropagation();
  };
  const beginInlineEditing = (textBoxId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (tab !== 'edit') return;
    const boxElement = event.currentTarget;
    setSelectedImageId(null);
    setSelectedTextBoxId(textBoxId);
    setEditingTextBoxId(textBoxId);
    setInspectorOpen(true);
    event.preventDefault();
    event.stopPropagation();
    window.requestAnimationFrame(() => {
      const editableTarget = boxElement.querySelector<HTMLElement>('[contenteditable="true"]');
      editableTarget?.focus();
      if (editableTarget) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editableTarget);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  };
  const addTextBox = () => {
    const id = crypto.randomUUID?.() ?? `text-${Date.now()}`;
    const box: SlideTextBox = { id, role: 'custom', content: '双击输入文字', x: 32, y: 42, width: 36, height: 10, fontSize: 20, bold: false, align: 'left', tone: 'foreground' };
    updateCurrentTextBoxes(boxes => [...boxes, box]);
    setSelectedTextBoxId(id);
    setSelectedImageId(null);
    setEditingTextBoxId(null);
    showNotice('已插入独立文本框，双击即可输入。');
  };
  const deleteSelectedTextBox = () => {
    if (!selectedTextBoxId) return;
    updateCurrentTextBoxes(boxes => boxes.filter(box => box.id !== selectedTextBoxId));
    setSelectedTextBoxId(null);
    setEditingTextBoxId(null);
    showNotice('文本框已从当前页面移除。');
  };
  const updateCurrentImages = (updater: (images: SlideImage[]) => SlideImage[]) => {
    setDeckSlides(items => items.map((item, index) => index === current
      ? { ...item, images: updater(item.images?.map(image => ({ ...image })) ?? []) }
      : item));
  };
  const clampImage = (image: SlideImage): SlideImage => {
    const width = Math.round(Math.max(6, Math.min(90, image.width)) * 10) / 10;
    const height = Math.round(Math.max(6, Math.min(80, image.height)) * 10) / 10;
    return {
      ...image,
      width,
      height,
      x: Math.round(Math.max(0, Math.min(100 - width, image.x)) * 10) / 10,
      y: Math.round(Math.max(0, Math.min(100 - height, image.y)) * 10) / 10,
    };
  };
  const updateImage = (imageId: string, changes: Partial<SlideImage>) => {
    updateCurrentImages(images => images.map(image => image.id === imageId ? clampImage({ ...image, ...changes }) : image));
  };
  const deleteSelectedImage = () => {
    if (!selectedImageId) return;
    updateCurrentImages(images => images.filter(image => image.id !== selectedImageId));
    setSelectedImageId(null);
    showNotice('图片已从当前页面移除。');
  };
  const readImageFile = (file: File) => new Promise<{ src: string; width: number; height: number }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = String(reader.result ?? '');
      const preview = new Image();
      preview.onerror = () => reject(new Error('IMAGE_DECODE_FAILED'));
      preview.onload = () => resolve({ src, width: preview.naturalWidth, height: preview.naturalHeight });
      preview.src = src;
    };
    reader.readAsDataURL(file);
  });
  const importImageFiles = async (files: File[], targetImageId: string | null = replaceImageId) => {
    const candidates = files.filter(file => file.type.startsWith('image/'));
    if (!candidates.length) {
      showNotice('请选择 PNG、JPG、WebP、GIF 或 SVG 图片。');
      return;
    }
    const oversized = candidates.find(file => file.size > 10 * 1024 * 1024);
    if (oversized) {
      showNotice(`${oversized.name} 超过 10MB，请压缩后再试。`);
      return;
    }
    try {
      if (targetImageId) {
        const file = candidates[0];
        const loaded = await readImageFile(file);
        updateImage(targetImageId, { name: file.name, alt: file.name.replace(/\.[^.]+$/, ''), src: loaded.src });
        setSelectedImageId(targetImageId);
        setReplaceImageId(null);
        showNotice('图片已替换，位置和尺寸保持不变。');
        return;
      }
      const additions: SlideImage[] = [];
      for (const file of candidates) {
        const loaded = await readImageFile(file);
        const aspect = Math.max(.2, Math.min(5, loaded.width / loaded.height));
        let width = 32;
        let height = (width / aspect) * (16 / 9);
        if (height > 56) {
          height = 56;
          width = height * aspect * (9 / 16);
        }
        const offset = additions.length * 2;
        additions.push(clampImage({
          id: crypto.randomUUID?.() ?? `image-${Date.now()}-${additions.length}`,
          name: file.name,
          src: loaded.src,
          alt: file.name.replace(/\.[^.]+$/, ''),
          x: 50 - width / 2 + offset,
          y: 50 - height / 2 + offset,
          width,
          height,
        }));
      }
      updateCurrentImages(images => [...images, ...additions]);
      setSelectedImageId(additions.at(-1)?.id ?? null);
      setSelectedTextBoxId(null);
      setEditingTextBoxId(null);
      showNotice(`已插入 ${additions.length} 张图片，可拖动或从右下角缩放。`);
    } catch {
      showNotice('图片读取失败，请换一张图片后重试。');
    } finally {
      setReplaceImageId(null);
    }
  };
  const handleImageInput = (event: ReactChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    void importImageFiles(files, replaceImageId);
  };
  const openImagePicker = (imageId: string | null = null) => {
    setReplaceImageId(imageId);
    if (imageInputRef.current) imageInputRef.current.value = '';
    imageInputRef.current?.click();
  };
  const startImageDrag = (imageId: string, event: ReactPointerEvent<HTMLDivElement>) => {
    if (tab !== 'edit' || event.button !== 0) return;
    const image = slide.images?.find(item => item.id === imageId);
    const artwork = event.currentTarget.closest<HTMLElement>('.ppt-slide-art');
    if (!image || !artwork) return;
    const bounds = artwork.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedImageId(imageId);
    setSelectedTextBoxId(null);
    setEditingTextBoxId(null);
    slideImageDragRef.current = {
      pointerId: event.pointerId,
      imageId,
      mode: 'move',
      startClientX: event.clientX,
      startClientY: event.clientY,
      startImage: { ...image },
      slideWidth: bounds.width,
      slideHeight: bounds.height,
    };
    event.preventDefault();
    event.stopPropagation();
  };
  const startImageResize = (imageId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const image = slide.images?.find(item => item.id === imageId);
    const artwork = event.currentTarget.closest<HTMLElement>('.ppt-slide-art');
    if (!image || !artwork) return;
    const bounds = artwork.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    slideImageDragRef.current = {
      pointerId: event.pointerId,
      imageId,
      mode: 'resize',
      startClientX: event.clientX,
      startClientY: event.clientY,
      startImage: { ...image },
      slideWidth: bounds.width,
      slideHeight: bounds.height,
    };
    event.preventDefault();
    event.stopPropagation();
  };
  const moveImage = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = slideImageDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = ((event.clientX - drag.startClientX) / drag.slideWidth) * 100;
    const dy = ((event.clientY - drag.startClientY) / drag.slideHeight) * 100;
    if (drag.mode === 'move') {
      updateImage(drag.imageId, { x: drag.startImage.x + dx, y: drag.startImage.y + dy });
    } else {
      const width = Math.max(6, drag.startImage.width + dx);
      const height = width * (drag.startImage.height / drag.startImage.width);
      updateImage(drag.imageId, { width, height });
    }
    event.preventDefault();
    event.stopPropagation();
  };
  const finishImageDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = slideImageDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    slideImageDragRef.current = null;
    event.stopPropagation();
  };
  const replaceImageFromCanvas = (imageId: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedImageId(imageId);
    setSelectedTextBoxId(null);
    setEditingTextBoxId(null);
    openImagePicker(imageId);
  };
  const updateSelectedImageMetric = (field: 'x' | 'y' | 'width' | 'height', rawValue: string) => {
    if (!selectedImage) return;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    updateImage(selectedImage.id, { [field]: value });
  };
  const updateSelectedTextMetric = (field: 'x' | 'y' | 'width' | 'height' | 'fontSize', rawValue: string) => {
    if (!selectedTextBox) return;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    updateTextBox(selectedTextBox.id, { [field]: value });
  };

  return (
    <div className="ppt-reader" ref={readerRef}>
      <input ref={imageInputRef} className="ppt-image-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" multiple={!replaceImageId} onChange={handleImageInput} />
      <header className="ppt-reader-header">
        <div className="ppt-file-identity">
          <div className="ppt-file-mark"><FileText size={18} strokeWidth={1.8} /></div>
          <div>
            <p>当前演示文稿</p>
            <h1>商业模式设计分析方法—TCH矩阵</h1>
          </div>
          <button className="ppt-file-menu" aria-label="文件选项"><ChevronDown size={15} /></button>
        </div>
        <div className="ppt-header-meta">
          <span>{deckSlides.length} 页</span><i /> <span>16:9</span><i /> <span>{isSlideModified ? '本页已修改' : '最后阅读：刚刚'}</span>
        </div>
        <div className="ppt-header-actions">
          <button className="ppt-quiet-action" onClick={openPresenter}><Presentation size={15} />演讲者模式</button>
          <button className="ppt-primary-action" onClick={tab === 'edit' ? finishEditing : startEditing}>
            {tab === 'edit' ? <><Save size={15} />完成编辑</> : <><Pencil size={15} />编辑内容</>}
          </button>
        </div>
      </header>

      <aside className={`ppt-file-sidebar${fileBrowserOpen ? ' is-open' : ''}`} aria-label="PPT 文件侧边栏" aria-hidden={!fileBrowserOpen}>
        <div className="ppt-file-sidebar-header">
          <div><FolderOpen size={15} /><span>文件浏览</span></div>
          <div>
            <button className="ppt-folder-picker" onClick={() => void chooseFolder()} aria-label="选择文件夹" title="选择文件夹"><FolderOpen size={14} /></button>
            <button className="ppt-file-sidebar-close" onClick={() => setFileBrowserOpen(false)} aria-label="收起文件侧边栏" title="收起为标签"><ChevronLeft size={15} /></button>
          </div>
        </div>
        <div className="ppt-folder-location">
          <button onClick={() => void goToParentDirectory()} disabled={folderHistory.length < 2} aria-label="返回上一级文件夹"><ChevronLeft size={13} /></button>
          <Folder size={13} />
          <span title={folderHistory.at(-1)?.name || '示例课件'}>{folderHistory.at(-1)?.name || '示例课件'}</span>
        </div>
        <div className="ppt-file-list">
          {folderLoading && <div className="ppt-file-empty">正在读取…</div>}
          {!folderLoading && browserEntries.map(entry => (
            <button
              key={`${entry.kind}-${entry.name}`}
              className={`ppt-file-entry${entry.kind === 'ppt' && selectedPpt === entry.name ? ' is-active' : ''}`}
              onClick={() => entry.kind === 'directory' ? void openDirectory(entry) : selectPpt(entry)}
              title={entry.name}
            >
              {entry.kind === 'directory' ? <Folder size={14} fill="currentColor" /> : <FileText size={14} />}
              <span>{entry.name}</span>
              {entry.kind === 'directory' ? <ChevronRight size={12} /> : <small>{entry.name.toLowerCase().endsWith('.pptx') ? 'PPTX' : 'PPT'}</small>}
            </button>
          ))}
          {!folderLoading && browserEntries.length === 0 && <div className="ppt-file-empty">此文件夹没有 PPT</div>}
        </div>
        <div className="ppt-file-sidebar-footer">
          <button className="ppt-change-folder" onClick={() => void chooseFolder()}><FolderOpen size={13} />切换文件夹</button>
          <p className="ppt-file-filter">仅显示文件夹与 PPT 文件</p>
        </div>
      </aside>
      <button
        className={`ppt-file-sidebar-tag${fileBrowserOpen ? ' is-hidden' : ''}`}
        style={{ top: fileTabTop }}
        onClick={openFileSidebarFromTag}
        onKeyDown={moveFileTabWithKeyboard}
        onPointerDown={startFileTabDrag}
        onPointerMove={moveFileTab}
        onPointerUp={finishFileTabDrag}
        onPointerCancel={finishFileTabDrag}
        aria-label="文件侧边栏：拖动可上下移动，点击展开"
        title="上下拖动调整位置，点击展开"
      >
        <FolderOpen size={15} />
        <span>文件</span>
      </button>

      <div className={`ppt-reader-body${inspectorOpen ? '' : ' inspector-closed'}${tab === 'edit' ? ' is-editing' : ''}`}>
        <aside className="ppt-thumbnail-rail" aria-label="幻灯片导航">
          <div className="ppt-search-box">
            <Search size={14} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索演示文稿" aria-label="搜索演示文稿" />
            {query && <button onClick={() => setQuery('')} aria-label="清除搜索"><X size={13} /></button>}
          </div>
          <div className="ppt-rail-label"><span>幻灯片</span><span>{matchingSlides.length}/{deckSlides.length}</span></div>
          <div className="ppt-thumbnail-list">
            {sectionOrder.map(section => {
              const sectionSlides = matchingSlides.filter(item => item.section === section);
              if (!sectionSlides.length) return null;
              return <section key={section}>
                <h2>{section}</h2>
                {sectionSlides.map(item => (
                  <button
                    key={item.number}
                    className={`ppt-thumbnail${item.number === slide.number ? ' is-active' : ''}`}
                    onClick={() => setCurrent(item.number - 1)}
                    aria-label={`第 ${item.number} 页：${item.title}`}
                  >
                    <span className="ppt-thumbnail-number">{String(item.number).padStart(2, '0')}</span>
                    <span className="ppt-thumbnail-preview"><SlideArtwork slide={item} compact /></span>
                    {bookmarks.has(item.number) && <Bookmark className="ppt-thumbnail-bookmark" size={11} fill="currentColor" />}
                  </button>
                ))}
              </section>;
            })}
            {!matchingSlides.length && <div className="ppt-no-results"><Search size={22} /><p>没有匹配的页面</p><button onClick={() => setQuery('')}>清除搜索</button></div>}
          </div>
        </aside>

        <main className="ppt-stage-column">
          <div className="ppt-stage-toolbar">
            <div className="ppt-page-control">
              <button onClick={() => setCurrent(value => Math.max(0, value - 1))} disabled={current === 0} aria-label="上一页"><ArrowLeft size={16} /></button>
              <span><strong>{slide.number}</strong> / {deckSlides.length}</span>
              <button onClick={() => setCurrent(value => Math.min(deckSlides.length - 1, value + 1))} disabled={current === deckSlides.length - 1} aria-label="下一页"><ArrowRight size={16} /></button>
            </div>
            <div className="ppt-toolbar-center">
              {tab === 'edit' && <div className="ppt-edit-tools" aria-label="编辑工具">
                <button onClick={addTextBox} title="插入独立文本框"><Type size={14} />文本框</button>
                <button onClick={() => openImagePicker()} title="从本地插入图片"><ImagePlus size={14} />插入图片</button>
                {(selectedImage || selectedTextBox) && <button onClick={selectedImage ? deleteSelectedImage : deleteSelectedTextBox} title="删除选中对象"><Trash2 size={13} />删除</button>}
              </div>}
              <div className="ppt-zoom-control">
                <button onClick={() => setZoom(value => Math.max(60, value - 10))} aria-label="缩小"><Minus size={14} /></button>
                <button className="ppt-zoom-value" onClick={() => setZoom(88)} title="恢复适应窗口">{zoom}%</button>
                <button onClick={() => setZoom(value => Math.min(130, value + 10))} aria-label="放大"><Plus size={14} /></button>
              </div>
            </div>
            <div className="ppt-view-actions">
              <button className={bookmarks.has(slide.number) ? 'is-active' : ''} onClick={toggleBookmark} aria-label="收藏当前页"><Bookmark size={15} fill={bookmarks.has(slide.number) ? 'currentColor' : 'none'} /></button>
              <button onClick={enterFullscreen} aria-label="全屏阅读"><Maximize2 size={15} /></button>
              <button onClick={() => setInspectorOpen(value => !value)} aria-label={inspectorOpen ? '收起详情' : '展开详情'}>
                {inspectorOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </button>
            </div>
          </div>

          <div
            className="ppt-stage-scroll"
            onDragOver={event => {
              if (tab === 'edit' && Array.from(event.dataTransfer.types).includes('Files')) event.preventDefault();
            }}
            onDrop={event => {
              if (tab !== 'edit') return;
              const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
              if (!files.length) return;
              event.preventDefault();
              setReplaceImageId(null);
              void importImageFiles(files, null);
            }}
          >
            <div className="ppt-stage" style={{ '--slide-zoom': zoom / 100 } as React.CSSProperties}>
              <SlideArtwork
                slide={slide}
                editable={tab === 'edit'}
                selectedTextBoxId={selectedTextBoxId}
                selectedImageId={selectedImageId}
                editingTextBoxId={editingTextBoxId}
                onTextBoxPointerDown={startTextBoxDrag}
                onTextBoxPointerMove={moveTextBox}
                onTextBoxPointerUp={finishTextBoxDrag}
                onTextBoxDoubleClick={beginInlineEditing}
                onTextBoxCommit={commitTextBox}
                onTextBoxResizePointerDown={startTextBoxResize}
                onExitInlineEditing={() => setEditingTextBoxId(null)}
                onImagePointerDown={startImageDrag}
                onImagePointerMove={moveImage}
                onImagePointerUp={finishImageDrag}
                onImageDoubleClick={replaceImageFromCanvas}
                onImageResizePointerDown={startImageResize}
              />
            </div>
          </div>

          <footer className="ppt-stage-footer">
            <div><span style={{ width: `${(slide.number / deckSlides.length) * 100}%` }} /></div>
            <p>{slide.section}</p>
            <span>{tab === 'edit' ? '单击选中 · 拖动定位 · 双击编辑' : '使用 ← → 切换页面'}</span>
          </footer>
        </main>

        <aside className="ppt-inspector" aria-label="页面详情">
          <div className="ppt-inspector-heading">
            <div><span>第 {String(slide.number).padStart(2, '0')} 页</span><h2>{slide.title}</h2></div>
            <button onClick={() => setInspectorOpen(false)} aria-label="收起详情"><X size={16} /></button>
          </div>
          <div className="ppt-inspector-tabs" role="tablist">
            <button className={tab === 'summary' ? 'is-active' : ''} onClick={() => setTab('summary')} role="tab">概要</button>
            <button className={tab === 'text' ? 'is-active' : ''} onClick={() => setTab('text')} role="tab">文字</button>
            <button className={tab === 'analysis' ? 'is-active' : ''} onClick={() => setTab('analysis')} role="tab">讲解</button>
            <button className={tab === 'edit' ? 'is-active' : ''} onClick={() => setTab('edit')} role="tab">编辑</button>
          </div>
          <div className="ppt-inspector-content">
            {tab === 'summary' && <>
              <p className="ppt-inspector-lead">{slide.summary}</p>
              <h3>本页要点</h3>
              <ol>{slide.bullets.map((item, index) => <li key={`${index}-${item}`}><Check size={13} />{item}</li>)}</ol>
              <h3>内容标签</h3>
              <div className="ppt-tag-list">{slide.tags.map((tag, index) => <span key={`${index}-${tag}`}>{tag}</span>)}</div>
            </>}
            {tab === 'text' && <>
              <div className="ppt-text-block"><span>{slide.eyebrow}</span><h3>{slide.title}</h3><p>{slide.summary}</p>{slide.bullets.map((item, index) => <p key={`${index}-${item}`}>• {item}</p>)}</div>
              <p className="ppt-data-hint"><Focus size={14} />文字已按阅读顺序整理，原始视觉布局保留在左侧画面中。</p>
            </>}
            {tab === 'analysis' && <SpeakerAnalysisPanel slide={slide} nextSlide={deckSlides[current + 1]} />}
            {tab === 'edit' && <div className="ppt-editor">
              <p className="ppt-editor-notice"><Move size={14} />每段文字都是独立文本框。单击选择，拖动定位，拖角点缩放，双击进入框内编辑。</p>
              <section className="ppt-layout-controls" aria-label="对象精确位置">
                <div className="ppt-layout-heading"><span>{selectedImage ? '图片格式' : selectedTextBox ? '文本框格式' : '未选择对象'}</span><small>{selectedImage || selectedTextBox ? '单位：页面 %' : '请在画布中选择'}</small></div>
                {selectedImage ? <>
                  <div className="ppt-selected-file" title={selectedImage.name}><ImagePlus size={13} /><span>{selectedImage.name}</span></div>
                  <div className="ppt-coordinate-grid is-four">
                    <label><span>水平 X</span><input type="number" min={0} max={100 - selectedImage.width} step={0.5} value={selectedImage.x} onChange={event => updateSelectedImageMetric('x', event.target.value)} /></label>
                    <label><span>垂直 Y</span><input type="number" min={0} max={100 - selectedImage.height} step={0.5} value={selectedImage.y} onChange={event => updateSelectedImageMetric('y', event.target.value)} /></label>
                    <label><span>宽度 W</span><input type="number" min={6} max={90} step={0.5} value={selectedImage.width} onChange={event => updateSelectedImageMetric('width', event.target.value)} /></label>
                    <label><span>高度 H</span><input type="number" min={6} max={80} step={0.5} value={selectedImage.height} onChange={event => updateSelectedImageMetric('height', event.target.value)} /></label>
                  </div>
                  <label className="ppt-image-alt"><span>图片说明</span><input value={selectedImage.alt} maxLength={100} onChange={event => updateImage(selectedImage.id, { alt: event.target.value })} /></label>
                  <div className="ppt-image-actions">
                    <button onClick={() => openImagePicker(selectedImage.id)}><ImagePlus size={12} />替换图片</button>
                    <button className="is-danger" onClick={deleteSelectedImage}><Trash2 size={12} />删除图片</button>
                  </div>
                </> : selectedTextBox ? <>
                  <label className="ppt-selected-text"><span>文本内容</span><textarea rows={4} value={selectedTextBox.content} onChange={event => commitTextBox(selectedTextBox.id, event.target.value)} /></label>
                  <div className="ppt-coordinate-grid is-four">
                    <label><span>水平 X</span><input type="number" min={0} max={100 - selectedTextBox.width} step={0.5} value={selectedTextBox.x} onChange={event => updateSelectedTextMetric('x', event.target.value)} /></label>
                    <label><span>垂直 Y</span><input type="number" min={0} max={100 - selectedTextBox.height} step={0.5} value={selectedTextBox.y} onChange={event => updateSelectedTextMetric('y', event.target.value)} /></label>
                    <label><span>宽度 W</span><input type="number" min={5} max={94} step={0.5} value={selectedTextBox.width} onChange={event => updateSelectedTextMetric('width', event.target.value)} /></label>
                    <label><span>高度 H</span><input type="number" min={3} max={88} step={0.5} value={selectedTextBox.height} onChange={event => updateSelectedTextMetric('height', event.target.value)} /></label>
                  </div>
                  <div className="ppt-text-format-row">
                    <label><span>字号</span><input type="number" min={6} max={72} step={1} value={selectedTextBox.fontSize} onChange={event => updateSelectedTextMetric('fontSize', event.target.value)} /></label>
                    <button className={selectedTextBox.bold ? 'is-active' : ''} onClick={() => updateTextBox(selectedTextBox.id, { bold: !selectedTextBox.bold })} aria-label="粗体"><strong>B</strong></button>
                    {(['left', 'center', 'right'] as const).map(align => <button key={align} className={selectedTextBox.align === align ? 'is-active' : ''} onClick={() => updateTextBox(selectedTextBox.id, { align })} aria-label={`${align} 对齐`}>{align === 'left' ? '≡←' : align === 'center' ? '≡' : '→≡'}</button>)}
                  </div>
                  <div className="ppt-tone-switch" aria-label="文字颜色">
                    {(['foreground', 'accent', 'muted'] as const).map(tone => <button key={tone} className={selectedTextBox.tone === tone ? 'is-active' : ''} onClick={() => updateTextBox(selectedTextBox.id, { tone })}>{tone === 'foreground' ? '正文' : tone === 'accent' ? '强调' : '弱化'}</button>)}
                  </div>
                  <button className="ppt-delete-object" onClick={deleteSelectedTextBox}><Trash2 size={12} />删除这个文本框</button>
                </> : <div className="ppt-empty-selection">
                  <p>画布中没有选中对象。</p>
                  <div><button onClick={addTextBox}><Type size={12} />插入文本框</button><button onClick={() => openImagePicker()}><ImagePlus size={12} />插入图片</button></div>
                </div>}
              </section>
              <div className="ppt-editor-actions">
                <button onClick={resetCurrentSlide} disabled={!isSlideModified}><Undo2 size={13} />恢复本页</button>
                <button className="is-primary" onClick={finishEditing}><Save size={13} />完成编辑</button>
              </div>
            </div>}
          </div>
        </aside>
      </div>

      {notice && <div className="ppt-reader-toast" role="status"><Check size={14} />{notice}</div>}
    </div>
  );
}

export function PptPresenter() {
  const startSlide = clampSlide((Number(new URLSearchParams(window.location.search).get('slide')) || 1) - 1);
  const [presenterSlides, setPresenterSlides] = useState<Slide[]>(() => cloneSlides(slides));
  const [current, setCurrent] = useState(startSlide);
  const [elapsed, setElapsed] = useState(0);
  const [notesOpen, setNotesOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const presenterRef = useRef<HTMLDivElement>(null);
  const syncOriginRef = useRef(`presenter-${Math.random().toString(36).slice(2)}`);
  const slide = presenterSlides[current];
  const nextSlide = presenterSlides[current + 1];

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = `演讲者模式 · ${slide.title}`;
  }, [slide.title]);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.onmessage = event => {
      if (event.data?.origin === syncOriginRef.current) return;
      if (event.data?.type === 'goto') {
        const next = Number(event.data.slide);
        if (Number.isInteger(next)) setCurrent(clampSlide(next));
      }
      if (event.data?.type === 'deck' && isSlideDeck(event.data.slides)) {
        setPresenterSlides(cloneSlides(event.data.slides));
      }
    };
    channel.postMessage({ type: 'request-deck', origin: syncOriginRef.current });
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.postMessage({ type: 'goto', slide: current, origin: syncOriginRef.current });
    channel.close();
  }, [current]);

  const go = (next: number) => setCurrent(clampSlide(next));
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await presenterRef.current?.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': go(current + 1); event.preventDefault(); break;
        case 'ArrowLeft': case 'PageUp': case 'Backspace': go(current - 1); event.preventDefault(); break;
        case 'Home': go(0); break;
        case 'End': go(slides.length - 1); break;
        case 'f': case 'F': void toggleFullscreen(); break;
        case 'n': case 'N': setNotesOpen(value => !value); break;
        case 'r': case 'R': setElapsed(0); break;
      }
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreen);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [current]);

  return (
    <div className={`ppt-presenter${isFullscreen ? ' is-fullscreen' : ''}${notesOpen ? '' : ' notes-closed'}`} ref={presenterRef}>
      <header className="ppt-presenter-header">
        <div className="ppt-presenter-title"><span><Presentation size={15} />演讲者模式</span><h1>商业模式设计分析方法—TCH矩阵</h1></div>
        <div className="ppt-presenter-status">
          <div><span>已演讲</span><strong>{formatElapsed(elapsed)}</strong></div>
          <i />
          <div><span>当前页面</span><strong>{slide.number} / {presenterSlides.length}</strong></div>
        </div>
        <div className="ppt-presenter-actions">
          <button onClick={() => setElapsed(0)}><RotateCcw size={14} />重置计时</button>
          <button onClick={() => setNotesOpen(value => !value)}>{notesOpen ? '隐藏讲稿' : '显示讲稿'}</button>
          <button className="is-primary" onClick={() => void toggleFullscreen()}><Maximize2 size={14} />全屏播放</button>
          <button className="is-icon" onClick={() => window.close()} aria-label="关闭演讲者窗口"><X size={17} /></button>
        </div>
      </header>

      <main className="ppt-presenter-body">
        <section className="ppt-presenter-current" aria-label="当前幻灯片">
          <div className="ppt-presenter-label"><span>当前页</span><strong>{String(slide.number).padStart(2, '0')}</strong></div>
          <div className="ppt-presenter-slide" onDoubleClick={() => void toggleFullscreen()}><SlideArtwork slide={slide} /></div>
        </section>

        <aside className="ppt-presenter-sidebar">
          <section className="ppt-presenter-next">
            <div className="ppt-presenter-label"><span>下一页</span><strong>{nextSlide ? String(nextSlide.number).padStart(2, '0') : 'END'}</strong></div>
            <div>{nextSlide ? <SlideArtwork slide={nextSlide} /> : <p>演示结束</p>}</div>
          </section>
          <section className="ppt-presenter-notes">
            <div className="ppt-presenter-label"><span>讲解提示</span><strong>约 90 秒</strong></div>
            <div className="ppt-presenter-script">
              <p className="ppt-presenter-intro">{slide.note}</p>
              <h2>{slide.title}</h2>
              <ul>{slide.bullets.map((bullet, index) => <li key={bullet}><span>{String(index + 1).padStart(2, '0')}</span>{bullet}</li>)}</ul>
              <p className="ppt-presenter-transition">接下来：{nextSlide ? nextSlide.title : '总结并邀请提问'}</p>
            </div>
          </section>
        </aside>
      </main>

      <footer className="ppt-presenter-footer">
        <div className="ppt-presenter-progress"><span style={{ width: `${(slide.number / presenterSlides.length) * 100}%` }} /></div>
        <div className="ppt-presenter-nav">
          <button onClick={() => go(current - 1)} disabled={current === 0}><ArrowLeft size={16} />上一页</button>
          <span><kbd>←</kbd><kbd>→</kbd> 翻页　<kbd>F</kbd> 全屏　<kbd>N</kbd> 讲稿　<kbd>R</kbd> 计时</span>
          <button onClick={() => go(current + 1)} disabled={current === presenterSlides.length - 1}>下一页<ArrowRight size={16} /></button>
        </div>
      </footer>

      <button className="ppt-fullscreen-exit" onClick={() => void toggleFullscreen()} aria-label="退出全屏">退出全屏</button>
    </div>
  );
}
