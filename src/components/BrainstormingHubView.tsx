import React, { useState } from 'react';
import { BrainstormRoom, BrainstormTask } from '../types/qartinia';
import {
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Tag,
  ListTodo,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';

interface BrainstormingHubViewProps {
  rooms: BrainstormRoom[];
  onCreateRoom: (payload: {
    title: string;
    topic: string;
    domain: string;
    isPrivate: boolean;
    tags: string[];
    participants: string[];
  }) => Promise<void>;
  onSendMessage: (roomId: string, content: string) => Promise<void>;
  onToggleTaskStatus: (
    roomId: string,
    taskId: string,
    nextStatus: BrainstormTask['status']
  ) => Promise<void>;
  onAddTask: (
    roomId: string,
    task: { title: string; assignee: string; priority: BrainstormTask['priority'] }
  ) => Promise<void>;
}

export const BrainstormingHubView: React.FC<BrainstormingHubViewProps> = ({
  rooms,
  onCreateRoom,
  onSendMessage,
  onToggleTaskStatus,
  onAddTask,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Message Input State
  const [messageInput, setMessageInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // New Task Inline State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Lead Engineer');
  const [newTaskPriority, setNewTaskPriority] = useState<BrainstormTask['priority']>('High');
  const [addingTask, setAddingTask] = useState(false);

  // New Room Modal State
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomTopic, setRoomTopic] = useState('');
  const [roomDomain, setRoomDomain] = useState('Power Electronics');
  const [roomTags, setRoomTags] = useState('800V, SiC, Gate Driver');
  const [creatingRoom, setCreatingRoom] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRoom) return;
    setSendingMsg(true);
    const content = messageInput;
    setMessageInput('');
    try {
      await onSendMessage(activeRoom.id, content);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeRoom) return;
    try {
      await onAddTask(activeRoom.id, {
        title: newTaskTitle,
        assignee: newTaskAssignee,
        priority: newTaskPriority,
      });
      setNewTaskTitle('');
      setAddingTask(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;
    setCreatingRoom(true);
    try {
      const tags = roomTags.split(',').map((t) => t.trim()).filter(Boolean);
      await onCreateRoom({
        title: roomTitle,
        topic: roomTopic,
        domain: roomDomain,
        isPrivate: false,
        tags,
        participants: ['Lead Engineer', 'PI Researcher', 'Qartinia AI Assistant'],
      });
      setNewRoomModalOpen(false);
      setRoomTitle('');
      setRoomTopic('');
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingRoom(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
              Collaborative Engineering Ideation
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537] mt-1">
              Technical Brainstorming Rooms
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Cross-disciplinary technical problem exploration linking industry engineering leads, laboratory PIs, and an AI research assistant grounded in peer-reviewed evidence.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewRoomModalOpen(true)}
            className="px-4 py-2.5 bg-[#0F2537] text-white text-xs font-semibold rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-2 cursor-pointer self-start md:self-center shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#C59B47]" />
            <span>New Technical Room</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Room Selector (Left) & Active Room Conversation + Tasks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Brainstorming Rooms List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider">
              Active Rooms ({rooms.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Collaboration</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {rooms.map((room) => {
              const isSelected = activeRoom?.id === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF9F6] border-[#0F2537] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#108548] px-1.5 py-0.5 rounded bg-slate-100">
                      {room.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{room.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0F2537] mt-2 leading-snug line-clamp-2">
                    {room.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{room.topic}</p>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.membersCount} participants</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <ListTodo className="w-3.5 h-3.5" />
                      <span>{room.tasks?.length || 0} tasks</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Active Room Messages & Task Management */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          {activeRoom ? (
            <>
              {/* Room Header Strip */}
              <div className="pb-4 border-b border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#108548] px-2 py-0.5 rounded bg-slate-100">
                      {activeRoom.domain}
                    </span>
                    <span className="text-xs text-slate-500">Created by {activeRoom.createdBy}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {activeRoom.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-slate-200 text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[#0F2537]">{activeRoom.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{activeRoom.topic}</p>
              </div>

              {/* Task Board Strip */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-[#108548]" />
                    <span>Action Tasks ({activeRoom.tasks?.length || 0})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddingTask(!addingTask)}
                    className="text-xs font-semibold text-[#0F2537] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                {addingTask && (
                  <form onSubmit={handleCreateTask} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task deliverable description..."
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        placeholder="Assignee"
                        className="p-1.5 border border-slate-200 rounded text-xs flex-1"
                      />
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                        className="p-1.5 border border-slate-200 rounded text-xs bg-white"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#0F2537] text-white rounded font-semibold text-xs cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-1.5">
                  {activeRoom.tasks?.map((task) => {
                    const isDone = task.status === 'Completed';
                    const isInProgress = task.status === 'In Progress';
                    return (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              const next = isDone ? 'Todo' : isInProgress ? 'Completed' : 'In Progress';
                              onToggleTaskStatus(activeRoom.id, task.id, next);
                            }}
                            className="cursor-pointer"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                isDone ? 'text-[#108548]' : 'text-slate-300 hover:text-slate-500'
                              }`}
                            />
                          </button>
                          <span className={isDone ? 'line-through text-slate-400' : 'text-[#0F2537] font-medium'}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-500">{task.assignee}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] ${
                              task.priority === 'High'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message History Stream */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider block">
                  Discussion Stream
                </span>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {activeRoom.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        msg.isAi
                          ? 'bg-[#FAF9F6] border-[#E8D8C3]'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                          {msg.isAi ? (
                            <span className="text-[#108548] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-[#C59B47]" />
                              <span>Qartinia AI Grounding Assistant</span>
                            </span>
                          ) : (
                            <span className="text-[#0F2537]">{msg.senderName}</span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            · {msg.senderRole}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                      </div>

                      <p className="text-slate-700">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSend} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Contribute engineering hypothesis, propose SPICE simulation, or request test bench..."
                    className="flex-1 p-2.5 text-xs bg-[#FAF9F6] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F2537]"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !messageInput.trim()}
                    className="px-4 py-2.5 bg-[#0F2537] text-white text-xs font-semibold rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C59B47]" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select or create a technical brainstorming room to begin.
            </div>
          )}
        </div>
      </div>

      {/* New Room Modal */}
      {newRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548] uppercase tracking-wider">
                  Technical Ideation
                </div>
                <h3 className="text-lg font-bold text-[#0F2537]">
                  Launch Technical Brainstorming Room
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewRoomModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRoom} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">
                  Investigation Title
                </label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  placeholder="e.g. 800V SiC Inverter: Active Gate Shaping for +0.7% WLTP Gain"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">
                  Core Engineering Question / Gap
                </label>
                <textarea
                  value={roomTopic}
                  onChange={(e) => setRoomTopic(e.target.value)}
                  placeholder="Describe the physical trade-off or gap between customer baseline and research frontier..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">Domain</label>
                  <input
                    type="text"
                    value={roomDomain}
                    onChange={(e) => setRoomDomain(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={roomTags}
                    onChange={(e) => setRoomTags(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewRoomModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRoom}
                  className="px-5 py-2 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C59B47]" />
                  <span>{creatingRoom ? 'Creating Room...' : 'Launch Room'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
