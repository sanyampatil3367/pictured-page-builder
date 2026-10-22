export type RoomType =
  | "Classroom"
  | "Computer Lab"
  | "Physics Lab"
  | "Chemistry Lab"
  | "Electronics Lab"
  | "Mechanical Lab"
  | "Office"
  | "Principal Office"
  | "Staff Room"
  | "Seminar Hall"
  | "Auditorium"
  | "Library"
  | "Washroom"
  | "Store Room"
  | "Server Room"
  | "Workshop"
  | "Other";

export type Room = {
  id: string;
  number: string;
  name: string;
  type: RoomType;
  capacity: number;
  floorId: string;
  buildingId: string;
};

export type Floor = {
  id: string;
  name: string;
  number: number;
  buildingId: string;
  rooms: Room[];
};

export type Building = {
  id: string;
  name: string;
  code: string;
  description: string;
  floors: Floor[];
};

export type Campus = {
  id: string;
  name: string;
  code: string;
  address: string;
  buildings: Building[];
};

/**
 * Creates a unique, predictable ID.
 *
 * In the final Supabase version these IDs will come
 * from the database. For the current frontend MVP,
 * predictable IDs make the generated campus easier
 * to work with.
 */
export function createId(prefix: string, ...parts: (string | number)[]) {
  return `${prefix}-${parts.join("-").toLowerCase().replace(/\s+/g, "-")}`;
}

/**
 * Generates a room number.
 *
 * Examples:
 *
 * Floor 0 → G01, G02, G03...
 * Floor 1 → 101, 102, 103...
 * Floor 2 → 201, 202, 203...
 *
 * The numbering can later be overridden manually
 * by the administrator.
 */
export function generateRoomNumber(
  floorNumber: number,
  roomIndex: number,
  options?: {
    groundFloorPrefix?: string;
    roomDigits?: number;
  },
) {
  const groundFloorPrefix = options?.groundFloorPrefix ?? "G";
  const roomDigits = options?.roomDigits ?? 2;

  const roomPart = String(roomIndex).padStart(roomDigits, "0");

  if (floorNumber === 0) {
    return `${groundFloorPrefix}${roomPart}`;
  }

  return `${floorNumber}${roomPart}`;
}

/**
 * Creates rooms for a floor automatically.
 */
export function generateRooms({
  buildingId,
  floorId,
  floorNumber,
  roomCount,
  buildingCode,
  defaultRoomType = "Classroom",
  startingRoomIndex = 1,
  capacity = 60,
}: {
  buildingId: string;
  floorId: string;
  floorNumber: number;
  roomCount: number;
  buildingCode: string;
  defaultRoomType?: RoomType;
  startingRoomIndex?: number;
  capacity?: number;
}): Room[] {
  return Array.from({ length: roomCount }, (_, index) => {
    const roomIndex = startingRoomIndex + index;
    const number = generateRoomNumber(floorNumber, roomIndex);

    return {
      id: createId("room", buildingCode, floorNumber, roomIndex),
      number,
      name: number,
      type: defaultRoomType,
      capacity,
      floorId,
      buildingId,
    };
  });
}

/**
 * Creates a floor and automatically generates its rooms.
 */
export function generateFloor({
  buildingId,
  buildingCode,
  floorNumber,
  roomCount,
  roomType = "Classroom",
  capacity = 60,
}: {
  buildingId: string;
  buildingCode: string;
  floorNumber: number;
  roomCount: number;
  roomType?: RoomType;
  capacity?: number;
}): Floor {
  const floorId = createId("floor", buildingCode, floorNumber);

  return {
    id: floorId,
    name: floorNumber === 0 ? "Ground Floor" : `Floor ${floorNumber}`,
    number: floorNumber,
    buildingId,
    rooms: generateRooms({
      buildingId,
      floorId,
      floorNumber,
      roomCount,
      buildingCode,
      defaultRoomType: roomType,
      capacity,
    }),
  };
}

/**
 * Creates an entire building from the administrator's
 * initial setup information.
 *
 * Example:
 *
 * floors: 3
 * roomsPerFloor: 8
 *
 * automatically creates:
 *
 * Ground → 8 rooms
 * Floor 1 → 8 rooms
 * Floor 2 → 8 rooms
 */
export function generateBuilding({
  name,
  code,
  description = "",
  floorCount,
  roomsPerFloor,
  defaultRoomType = "Classroom",
  roomCapacity = 60,
  includeGroundFloor = true,
}: {
  name: string;
  code: string;
  description?: string;
  floorCount: number;
  roomsPerFloor: number;
  defaultRoomType?: RoomType;
  roomCapacity?: number;
  includeGroundFloor?: boolean;
}): Building {
  const buildingId = createId("building", code);

  const startingFloor = includeGroundFloor ? 0 : 1;

  const floors = Array.from(
    { length: floorCount },
    (_, index) => {
      const floorNumber = startingFloor + index;

      return generateFloor({
        buildingId,
        buildingCode: code,
        floorNumber,
        roomCount: roomsPerFloor,
        roomType: defaultRoomType,
        capacity: roomCapacity,
      });
    },
  );

  return {
    id: buildingId,
    name,
    code,
    description,
    floors,
  };
}

/**
 * Creates a complete campus from the information
 * entered during campus onboarding.
 */
export function generateCampus({
  id = "campus-main",
  name,
  code,
  address = "",
  buildings,
}: {
  id?: string;
  name: string;
  code: string;
  address?: string;
  buildings: BuildingSetup[];
}): Campus {
  return {
    id,
    name,
    code,
    address,
    buildings: buildings.map((building) =>
      generateBuilding(building),
    ),
  };
}

export type BuildingSetup = {
  name: string;
  code: string;
  description?: string;
  floorCount: number;
  roomsPerFloor: number;
  defaultRoomType?: RoomType;
  roomCapacity?: number;
  includeGroundFloor?: boolean;
};

/**
 * Finds a building by ID.
 */
export function findBuilding(
  campus: Campus,
  buildingId: string,
): Building | undefined {
  return campus.buildings.find(
    (building) => building.id === buildingId,
  );
}

/**
 * Finds a floor by ID.
 */
export function findFloor(
  campus: Campus,
  floorId: string,
): Floor | undefined {
  for (const building of campus.buildings) {
    const floor = building.floors.find(
      (floor) => floor.id === floorId,
    );

    if (floor) {
      return floor;
    }
  }

  return undefined;
}

/**
 * Finds a room by ID.
 */
export function findRoom(
  campus: Campus,
  roomId: string,
): Room | undefined {
  for (const building of campus.buildings) {
    for (const floor of building.floors) {
      const room = floor.rooms.find(
        (room) => room.id === roomId,
      );

      if (room) {
        return room;
      }
    }
  }

  return undefined;
}

/**
 * Returns useful campus statistics.
 *
 * These calculations are kept outside the UI so that
 * the Digital Twin, Admin Dashboard, Analytics and
 * other modules can reuse the same logic.
 */
export function getCampusStats(campus: Campus) {
  const buildings = campus.buildings.length;

  const floors = campus.buildings.reduce(
    (total, building) => total + building.floors.length,
    0,
  );

  const rooms = campus.buildings.reduce(
    (total, building) =>
      total +
      building.floors.reduce(
        (floorTotal, floor) =>
          floorTotal + floor.rooms.length,
        0,
      ),
    0,
  );

  const capacity = campus.buildings.reduce(
    (total, building) =>
      total +
      building.floors.reduce(
        (floorTotal, floor) =>
          floorTotal +
          floor.rooms.reduce(
            (roomTotal, room) =>
              roomTotal + room.capacity,
            0,
          ),
        0,
      ),
    0,
  );

  return {
    buildings,
    floors,
    rooms,
    capacity,
  };
}

/**
 * Flattens all rooms into one array.
 *
 * Useful for:
 * - search
 * - reports
 * - maintenance
 * - analytics
 * - room selection
 * - timetable
 */
export function getAllRooms(campus: Campus): Room[] {
  return campus.buildings.flatMap((building) =>
    building.floors.flatMap((floor) => floor.rooms),
  );
}

/**
 * Flattens all floors into one array.
 */
export function getAllFloors(campus: Campus): Floor[] {
  return campus.buildings.flatMap(
    (building) => building.floors,
  );
}

/**
 * Returns the complete hierarchy information for a room.
 *
 * This is useful when a report only knows the room ID
 * but needs to display:
 *
 * Block A → Floor 2 → Room 204
 */
export function getRoomHierarchy(
  campus: Campus,
  roomId: string,
) {
  for (const building of campus.buildings) {
    for (const floor of building.floors) {
      const room = floor.rooms.find(
        (item) => item.id === roomId,
      );

      if (room) {
        return {
          building,
          floor,
          room,
        };
      }
    }
  }

  return undefined;
}

/**
 * Demo campus.
 *
 * This is ONLY temporary.
 *
 * Later this object will be replaced by data loaded
 * from Supabase after the admin creates the campus.
 */
export const DEMO_CAMPUS: Campus = generateCampus({
  name: "Dayananda Sagar College of Engineering",
  code: "DSCE001",
  address: "Bengaluru, Karnataka",
  buildings: [
    {
      name: "Block A",
      code: "A",
      description: "Academic Block A",
      floorCount: 3,
      roomsPerFloor: 8,
      defaultRoomType: "Classroom",
      roomCapacity: 60,
      includeGroundFloor: false,
    },
    {
      name: "Block B",
      code: "B",
      description: "Academic Block B",
      floorCount: 2,
      roomsPerFloor: 10,
      defaultRoomType: "Classroom",
      roomCapacity: 60,
      includeGroundFloor: true,
    },
    {
      name: "Science Block",
      code: "SCI",
      description: "Science and laboratory facilities",
      floorCount: 3,
      roomsPerFloor: 6,
      defaultRoomType: "Physics Lab",
      roomCapacity: 40,
      includeGroundFloor: true,
    },
  ],
});