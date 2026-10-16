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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8C6527]" />
              <span>Collaborative Engineering Ideation</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2038] mt-1.5">
              Technical Brainstorming Rooms
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-2xl leading-relaxed">
              Cross-disciplinary technical problem exploration linking industry engineering leads, laboratory PIs, and an AI research assistant grounded in peer-reviewed evidence.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewRoomModalOpen(true)}
            className="px-4 py-2.5 bg-[#0F2038] text-white text-xs font-serif font-bold rounded-xl hover:bg-[#1A365D] transition-colors flex items-center gap-2 cursor-pointer self-start md:self-center shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Technical Room</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Room Selector (Left) & Active Room Conversation + Tasks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Brainstorming Rooms List */}
        <div className="lg:col-span-4 bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D7]">
            <h2 className="text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono">
              Active Rooms ({rooms.length})
            </h2>
            <span className="text-[11px] font-mono text-[#5A6E85]">Collaboration</span>
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
                      ? 'bg-[#FFFDF7] border-[#8C6527] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E5DDD0] hover:bg-white hover:border-[#D5C8B5]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#8C6527] px-2 py-0.5 rounded bg-white border border-[#E5DDD0]">
                      {room.domain}
                    </span>
                    <span className="text-[10px] text-[#5A6E85] font-mono">{room.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0F2038] font-serif mt-2 leading-snug line-clamp-2">
                    {room.title}
                  </h3>

                  <p className="text-[11px] text-[#5A6E85] mt-1 line-clamp-2 leading-relaxed">{room.topic}</p>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#EBE3D7] text-[11px] text-[#5A6E85]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#8C6527]" />
                      <span>{room.membersCount} participants</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <ListTodo className="w-3.5 h-3.5 text-[#8C6527]" />
                      <span>{room.tasks?.length || 0} tasks</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Active Room Messages & Task Management */}
        <div className="lg:col-span-8 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
          {activeRoom ? (
            <>
              {/* Room Header Strip */}
              <div className="pb-4 border-b border-[#EBE3D7] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#8C6527] px-2 py-0.5 rounded bg-[#FAF4EB] border border-[#D5C8B5]">
                      {activeRoom.domain}
                    </span>
                    <span className="text-xs text-[#5A6E85]">Created by <strong className="text-[#0F2038]">{activeRoom.createdBy}</strong></span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {activeRoom.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DDD0] text-[#5A6E85]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#0F2038]">{activeRoom.title}</h2>
                <p className="text-xs text-[#5A6E85] leading-relaxed">{activeRoom.topic}</p>
              </div>

              {/* Task Board Strip */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8C6527] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <ListTodo className="w-4 h-4 text-[#8C6527]" />
                    <span>Action Tasks ({activeRoom.tasks?.length || 0})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddingTask(!addingTask)}
                    className="text-xs font-semibold text-[#8C6527] hover:text-[#0F2038] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                {addingTask && (
                  <form onSubmit={handleCreateTask} className="p-3 bg-white border border-[#E5DDD0] rounded-xl space-y-2 text-xs shadow-xs">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task deliverable description..."
                      className="w-full px-3 py-2 border border-[#E5DDD0] rounded-lg text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        placeholder="Assignee"
                        className="p-2 border border-[#E5DDD0] rounded-lg text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] flex-1"
                      />
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                        className="p-2 border border-[#E5DDD0] rounded-lg text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527]"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-[#0F2038] text-white rounded-lg font-serif font-bold text-xs cursor-pointer shadow-xs"
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
                        className="p-2.5 rounded-xl bg-white border border-[#E5DDD0] flex items-center justify-between gap-3 text-xs shadow-2xs"
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
                                isDone ? 'text-emerald-600' : 'text-[#A0AEC0] hover:text-[#0F2038]'
                              }`}
                            />
                          </button>
                          <span className={isDone ? 'line-through text-[#A0AEC0]' : 'text-[#0F2038] font-medium'}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-[#5A6E85]">{task.assignee}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] ${
                              task.priority === 'High'
                                ? 'bg-amber-50 border border-amber-200 text-amber-900 font-bold'
                                : 'bg-[#FAF8F5] border border-[#E5DDD0] text-[#5A6E85]'
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
                <span className="text-xs font-bold text-[#8C6527] uppercase tracking-wider block font-mono">
                  Discussion Stream
                </span>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {activeRoom.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                        msg.isAi
                          ? 'bg-[#FAF4EB] border-[#D5C8B5] shadow-2xs'
                          : 'bg-white border-[#E5DDD0] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                          {msg.isAi ? (
                            <span className="text-[#8C6527] flex items-center gap-1.5 font-bold">
                              <Sparkles className="w-3.5 h-3.5 text-[#8C6527]" />
                              <span>Qartinia AI Grounding Assistant</span>
                            </span>
                          ) : (
                            <span className="text-[#0F2038] font-bold">{msg.senderName}</span>
                          )}
                          <span className="text-[11px] font-mono text-[#5A6E85] font-normal">
                            · {msg.senderRole}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5A6E85]">{msg.timestamp}</span>
                      </div>

                      <p className="text-[#0F2038]">{msg.content}</p>
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
                    className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527] text-[#0F2038] placeholder:text-[#A0AEC0]"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !messageInput.trim()}
                    className="px-4 py-2.5 bg-[#0F2038] text-white text-xs font-serif font-bold rounded-xl hover:bg-[#1A365D] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[#5A6E85] text-xs">
              Select or create a technical brainstorming room to begin.
            </div>
          )}
        </div>
      </div>

      {/* Floating Window: New Room Modal */}
      {newRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#E5DDD0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] text-[#8C6527]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0F2038]">
                    Launch Technical Brainstorming Room
                  </h3>
                  <div className="text-[11px] text-[#5A6E85] font-mono">
                    Cross-Disciplinary Engineering Exploration
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewRoomModalOpen(false)}
                className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRoom} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Investigation Title *
                </label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  placeholder="e.g. 800V SiC Inverter: Active Gate Shaping for +0.7% WLTP Gain"
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Core Engineering Question / Gap *
                </label>
                <textarea
                  value={roomTopic}
                  onChange={(e) => setRoomTopic(e.target.value)}
                  placeholder="Describe the physical trade-off or gap between customer baseline and research frontier..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">Domain *</label>
                  <input
                    type="text"
                    value={roomDomain}
                    onChange={(e) => setRoomDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={roomTags}
                    onChange={(e) => setRoomTags(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5DDD0] rounded-xl text-xs bg-white text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewRoomModalOpen(false)}
                  className="px-4 py-2 border border-[#E5DDD0] rounded-xl font-semibold text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRoom}
                  className="px-5 py-2 bg-[#0F2038] text-white font-serif font-bold rounded-xl hover:bg-[#1A365D] cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
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
