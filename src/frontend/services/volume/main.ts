
import { createService } from 'neurosys/services';
import { setVolume } from 'neurosys/services/volume';
import { Output } from 'neurosys/plugins';

const host = process.env.HOST || "localhost";
const port = process.env.PORT

const volumeOutputPlugin = new Output({
    label: "Volume",
    set: (score: number) => setVolume(score),
});

const server = createService({
    volume: volumeOutputPlugin,
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}/`));
