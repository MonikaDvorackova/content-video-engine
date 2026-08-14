import fixture from './fixtures/trend-story.json';
import {validateRenderBrief} from './validate';

if (!validateRenderBrief(fixture)) {
  throw new Error('Creative fixture is invalid');
}
